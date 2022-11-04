const express = require('express')
const app = express()
const AppError = require('../utils/AppError')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const xss = require('xss-clean')
const hemlet = require('helmet')
const { urlencoded } = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const userRouter = require('../routes/authRouter')
const consumerRouter = require('../routes/consumerRoutes')
const programRouter = require('../routes/programRouter')
const errorController = require('../controllers/errorController')
const TrainerRouter = require('../routes/trainerRouter')
const DairyRouter = require('../routes/dairyRouter')
const GoalsRouter = require('../routes/goalRoutes')
const GroupRouter = require('../routes/groupRouter')

app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'common'))

var corsOptions = {
    credentials: true,
    origin: function (origin, callback) {
        callback(null, true)
    },
}

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Credentials', true)
    next()
})

app.use(hemlet())

// for fetching request body
app.use(express.json({ limit: '10kb' }))
app.use(urlencoded({ limit: '10kb' }))
app.use(xss())
app.use(express.static('public'))

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
app.use('/api/v1/diaries', DairyRouter)
app.use('/api/v1/goals', GoalsRouter)
app.use('/api/v1/groups', GroupRouter)

if (process.env.NODE_ENV === 'development') {
    app.use('/test', (req, res) => {
        res.cookie('jwt', 'Bearer sdsfsdfadgfadgadgafdg', { maxAge: 24 * 60 * 60 * 1000, httpOnly: true })
        res.status(200).json({ isOk: true, data: { message: 'all good' } })
    })
}

app.all('*', (req, res, next) => {
    next(new AppError(`this url has not found: ${req.originalUrl}`, 404))
})

app.use(errorController)

module.exports = app
