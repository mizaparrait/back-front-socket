
const app = require('express')()
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

app.get('/', (req, res) => {
    res.send('<h1>Hey Socket.io</h1>')
})


// MultiplayerGameObject (referido como MGO de manera corta). Objeto con todas las tarjetas que juegen los jugadores.
// Es el objeto que permite el funcionamiento de la aplicación, y siempre tiene la información actualizada.
let multiplayerGameObject = {}

io.on('connection', (socket) => {
    console.log('Usuario Conectado')

    socket.on('newPlayerConnected', (playerID) => {
        console.log('este es el playerID', playerID + ' y el socket: ' + socket.id)

        // se registra un nuevo jugador en el objeto de juego.
        // -1 significa que no hay carta seleccionada
        multiplayerGameObject[playerID] = {playerID: playerID, card: {cardNumber: -1, position: -1}, showValue: false}
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

    socket.on('cardIsRemoved', (multiplayerCardArray) => {
        console.log('a card was removed')
        io.sockets.emit('CARD_REMOVED', multiplayerCardArray)
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