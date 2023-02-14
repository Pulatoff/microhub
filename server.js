require('dotenv').config({})
const sequlize = require('./configs/db')
const app = require('./middlewares/app')
const http = require('http')
const server = http.createServer(app)
const io = require('socket.io')(server)

const PORT = process.env.PORT || 8000

sequlize.sync()

server.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`))
