const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
    cors: {
        origins: [
            'http://127.0.0.1:5173/',
            'http://localhost:8080'
        ]
    }
})

app.get('/', (req, res) => {
    res.send('<h1>Hey Socket.io</h1>')
})

io.on('connection', (socket) => {
    console.log('Usuario Conectado')

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