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
    cors: { origin: 'localhost:3000', methods: ['GET', 'POST'], credentials: true },
})
const users = []

io.on('connection', (socket) => {
    socket.on('joinRoom', async (room) => {
        socket.join(room)
        const messages = await Message.findAll({ where: { room_number: room } })
        socket.broadcast.to(room).emit('message', messages)
    })

    socket.on('sendMessage', async (data) => {
        const date = new Date()
        const message = await Message.create({
            message: data.message,
            room_number: data.room,
            send_date: date.toISOString(),
            send_side: data.send_date,
            consumerId: data.consumerId,
            nutritionistId: data.nutritionistId,
        })

        socket.to(data.room).emit(message)
    })

    socket.on('disconnect', function () {
        console.log('user disconnected')
    })
})

server.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`))

/*io.on("connection", (socket) => {
    console.log(io.of("/").adapter);
    socket.on("joinRoom", ({ username, room }) => {
      const user = userJoin(socket.id, username, room);
  
      socket.join(user.room);
  
      // Welcome current user
      socket.emit("message", formatMessage(botName, "Welcome to ChatCord!"));
  
      // Broadcast when a user connects
      socket.broadcast
        .to(user.room)
        .emit(
          "message",
          formatMessage(botName, `${user.username} has joined the chat`)
        );
  
      // Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    });
  
    // Listen for chatMessage
    socket.on("chatMessage", (msg) => {
      const user = getCurrentUser(socket.id);
  
      io.to(user.room).emit("message", formatMessage(user.username, msg));
    });
  
    // Runs when client disconnects
    socket.on("disconnect", () => {
      const user = userLeave(socket.id);
  
      if (user) {
        io.to(user.room).emit(
          "message",
          formatMessage(botName, `${user.username} has left the chat`)
        );
  
        // Send users and room info
        io.to(user.room).emit("roomUsers", {
          room: user.room,
          users: getRoomUsers(user.room),
        });
      }
    });
  });
  */
