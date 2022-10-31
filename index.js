const { createSocket } = require('dgram')

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


// multiplayerGameObject
let multiplayerGameObject = {}

io.on('connection', (socket) => {
    console.log('Usuario Conectado')

    socket.on('newPlayerConnected', (playerID) => {
        console.log('este es el playerID', playerID + ' y el socket: ' + socket.id)

        // se registra otro jugador en el objeto de juego.
        multiplayerGameObject[playerID] = {playerID: playerID, card: null, showValue: false}
    })

    // evento de juego de cartas. Cuando la carta se manda al centro
    socket.on('cardToCenterBoard', (cardPlayed, playerID) => {

        
        multiplayerGameObject[playerID] = cardPlayed[playerID]
        
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