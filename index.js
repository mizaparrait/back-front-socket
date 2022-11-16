const { urlencoded, json } = require('express')
const { userInfo } = require('os')

const app = require('express')()
const mongoose = require('mongoose')
const user = require('./user.controller')
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
    cors: {
        origins: [
            'http://127.0.0.1:5173/',
            'http://127.0.0.1:8080/',
            'http://127.0.0.1:5175/',
            'http://127.0.0.1:5174/',

        ]
    }
})

app.use(json())

mongoose.connect('mongodb+srv://miza:123456db@testsock.syc2nfw.mongodb.net/pokerdb?retryWrites=true&w=majority')

app.get('/users', user.list)
app.get('/users/:id', user.get)
app.post('/users', user.create)
app.put('/users/:id', user.update)
app.patch('/users/:id', user.update)
app.delete('/users/:id', user.destroy)

app.get('*', (req, res) => {
    res.status(404).send('Esta pagina no existe')
})

// MultiplayerGameObject (referido como MGO de manera corta). Objeto con todas las tarjetas que juegen los jugadores.
// Es el objeto que permite el funcionamiento de la aplicación, y siempre tiene la información actualizada.
let multiplayerGameObject = {}

io.on('connection', (socket) => {
    console.log('Usuario Conectado')

    socket.on('newPlayerConnected', (playerID, playerName) => {
        console.log('este es el playerID', playerID + ' y el socket: ' + socket.id)

        // se registra un nuevo jugador en el objeto de juego (MGO).
        // -1 significa que no hay carta seleccionada. ID de -1 es que un jugador no tiene ID.
        multiplayerGameObject[playerID] = {playerName: playerName, playerID: playerID, card: {cardNumber: -1, position: -1}, showValue: false}

        // actualizamos objeto que indica que se unió otro jugador a la sala
        io.sockets.emit('PLAYER_JOINED', multiplayerGameObject)
    })

    /**
     * Evento que se ejecuta cuando cualquier jugador desde el cliente
     * manda una carta al centro. 
     */
    socket.on('cardToCenterBoard', (playerID, cardPlayed) => {

        // Se cambia la carta jugada de un jugador en específico dentro del objeto MGO.
        multiplayerGameObject[playerID] = cardPlayed[playerID]
        
        // Envía los últimos cambios a todos los jugadores de la app.
        io.sockets.emit('CARD_PLAYED', multiplayerGameObject)

        console.log('MGO',multiplayerGameObject)
    })

    /**
     * Funcion donde si todos los jugadores suben una carta, se despliega el boton de "Revelar" en el cliente.
     */
    socket.on('allCardsOnCenter', () => {
        io.sockets.emit('ALL_CARDS_ON_CENTER')
    })


    socket.on('revealBtnPressed', () => {
        io.sockets.emit('REVEAL_CARDS')
    })

    socket.on('cardReset', (playerID ,cardReset) => {
        console.log('player',playerID, 'removed a card')
        multiplayerGameObject = cardReset
        io.sockets.emit('CARD_REMOVED', multiplayerGameObject)
    })

    socket.on('decrement', (counter) => {
        console.log('Decrement')
        io.sockets.emit('COUNTER_DECREMENT', counter - 1)
    })

    socket.on('disconnect', () => {
        console.log('Usuario Desconectado')
    })
})

http.listen(3001, () => {
    console.log('Servidor Iniciado en puerto 3001')
})


module.exports = app