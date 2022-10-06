const express = require('express')
const app = express()
const userRouter = require('../routes/authRouter')
const consumerRouter = require('../routes/consumerRoutes')

app.use(express.json())

app.use('/api/v1/users', userRouter)
app.use('/api/v1/consumers', consumerRouter)

module.exports = app
