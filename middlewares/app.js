const express = require('express')
const app = express()
const AppError = require('../utils/AppError')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')

const userRouter = require('../routes/authRouter')
const consumerRouter = require('../routes/consumerRoutes')
const programRouter = require('../routes/programRouter')
const errorController = require('../controllers/errorController')
const TrainerRouter = require('../routes/trainerRouter')
const DairyController = require('../routes/dairyRouter')
const GoalsRouter = require('../routes/goalRoutes')

app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'common'))

// for fetching request body
app.use(express.json({ limit: '10kb' }))

const limit = rateLimit({
    max: 10,
    windowMs: 1 * 60 * 60 * 1000,
    message: 'Too many requests from this IP, Please try again later',
})

app.use('/api', limit)

// main routes
app.use('/api/v1/users', userRouter)
app.use('/api/v1/consumers', consumerRouter)
app.use('/api/v1/programs', programRouter)
app.use('/api/v1/trainers', TrainerRouter)
app.use('/api/v1/diaries', DairyController)
app.use('/api/v1/goals', GoalsRouter)

if (process.env.NODE_ENV === 'development') {
    app.use('/test', (req, res, next) => {
        res.status(200).json({ isOk: true, data: { message: 'all good' } })
    })
}

app.all('*', (req, res, next) => {
    next(new AppError(`this url has not found: ${req.originalUrl}`, 404))
})

app.use(errorController)

module.exports = app
