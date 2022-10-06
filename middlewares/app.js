const express = require('express')
const app = express()
const userRouter = require('../routes/authRouter')
const consumerRouter = require('../routes/consumerRoutes')
const errorController = require('../controllers/errorController')

app.use(express.json())

app.use('/api/v1/users', userRouter)
app.use('/api/v1/consumers', consumerRouter)

app.all(errorController)

module.exports = app
