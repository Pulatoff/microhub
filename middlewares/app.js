const express = require('express')
const app = express()
const userRouter = require('../routes/authRouter')
const consumerRouter = require('../routes/consumerRoutes')
const errorController = require('../controllers/errorController')
const AppError = require('../utils/AppError')

app.use(express.json())

app.use('/api/v1/users', userRouter)
app.use('/api/v1/consumers', consumerRouter)

app.all('*', (req, res, next) => {
    next(new AppError('Page not Found', 404))
})

app.use(errorController)

module.exports = app
