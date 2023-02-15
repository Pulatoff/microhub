require('dotenv').config({})
const sequlize = require('./configs/db')
const app = require('./middlewares/app')
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')

const PORT = process.env.PORT || 8000

sequlize.sync()

const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
})

io.on('connection', (socket) => {
    console.log('user connected')
    socket.on('disconnect', function () {
        console.log('user disconnected')
    })
})

server.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`))
