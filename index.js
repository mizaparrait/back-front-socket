const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
    cors: {
        origins: [
            'http://127.0.0.1:5173/',
            'http://localhost:8080',
            'http://127.0.0.1:5175/',

        ]
    }
})

app.get('/', (req, res) => {
    res.send('<h1>Hey Socket.io</h1>')
})

io.on('connection', (socket) => {
    console.log('Usuario Conectado')

    // evento de juego de cartas. Cuando la carta se manda al centro
    socket.on('cardToCenterBoard', (cardValue) => {
        console.log('en servidor sumé 10 pts a la carta', cardValue)
        cardValue.cardNumber = cardValue.cardNumber + 10
        io.sockets.emit('CARD_INCREMENT', cardValue)
    })

    socket.on('increment', (counter) => {
        console.log('Increment')
        io.sockets.emit('COUNTER_INCREMENT', counter + 1)
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