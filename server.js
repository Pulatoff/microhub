require('dotenv').config({})
const sequlize = require('./configs/db')
const app = require('./middlewares/app')
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const Message = require('./models/messageModel')
const PORT = process.env.PORT || 8000

sequlize.sync()

const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'], credentials: true },
})

io.on('connection', (socket) => {
    socket.on('join', async (room) => {
        try {
            socket.join(room)
            const messages = await Message.findAll({ where: { room_number: room } })
        } catch (error) {
            console.log(error)
        }
    })
    socket.on('messages', async (room) => {
        const messages = await Message.findAll({ where: { room_number: room } })
        socket.broadcast.to(room).emit('newMessages', messages)
    })
    socket.on('message', async (data) => {
        try {
            const { message, consumerId, nutritionistId, send_side, room } = data

            const newMessage = await Message.create({
                message,
                send_side,
                consumerId,
                nutritionistId: nutritionistId,
                room_number: room,
                send_date: new Date(),
            })

            io.to(room).emit('new:message', newMessage)
        } catch (error) {
            console.error(error)
        }
    })
})

server.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`))
