const express = require('express')
const app = express()
const AppError = require('../utils/AppError')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const multer = require('multer')
const upload = multer()
// app routes
const userRouter = require('../routes/userRoutes')
const consumerRouter = require('../routes/consumerRoutes')
const programRouter = require('../routes/programRoutes')
const errorController = require('../controllers/errorController')
const TrainerRouter = require('../routes/trainerRoutes')
const DairyRouter = require('../routes/dairyRoutes')
const GoalsRouter = require('../routes/goalRoutes')
const GroupRouter = require('../routes/groupRoutes')
const RecipeRouter = require('../routes/recipesRoutes')
const messageRouter = require('../routes/messageRoutes')

app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'common'))

var corsOptions = {
    credentials: true,
    origin: function (origin, callback) {
        callback(null, true)
    },
}

const sessionConfig = {
    secret: process.env.SESSION_SECRET,
    name: 'microhub',
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: 'strict',
    },
}

app.use(cors(corsOptions))
app.use(cookieParser())

if (process.env.NODE_ENV === 'production') {
    app.use('trust proxy', 1)
    sessionConfig.cookie.secure = true
}
app.use(session(sessionConfig))

// for fetching request body
app.use(express.json({ limit: '1000kb' }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

// main routes
app.use('/api/v1/users', userRouter)
app.use('/api/v1/consumers', consumerRouter)
app.use('/api/v1/programs', programRouter)
app.use('/api/v1/trainers', TrainerRouter)
app.use('/api/v1/diaries', DairyRouter)
app.use('/api/v1/goals', GoalsRouter)
app.use('/api/v1/groups', GroupRouter)
app.use('/api/v1/recipes', RecipeRouter)
app.use('/api/v1/messages', messageRouter)

app.get('/api/v1/units', (req, res, next) => {
    const appUnits = process.env.APP_UNITS.split(',')
    let units = []
    appUnits.map((val) => {
        if (val === 'g') {
            units.push({ name: 'gramm', value: 'g' })
        } else if (val === 'liter') {
            units.push({ name: 'liter', value: 'liter' })
        }
    })
    if (units.length === 0)
        units = [
            { name: 'gramm', value: 'g' },
            { name: 'liter', value: 'liter' },
        ]

    res.status(200).json({ isOk: true, status: 'success', data: { units }, message: 'You are successfully get units' })
})

if (process.env.NODE_ENV === 'development') {
    app.use('/test', (req, res) => {
        res.cookie('jwt', 'Bearer sdsfsdfadgfadgadgafdg', {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'none',
        })
        res.status(200).json({ isOk: true, data: { message: 'all good' } })
    })
}

app.all('*', (req, res, next) => {
    next(new AppError(`this url has not found: ${req.originalUrl}`, 404))
})

app.use(errorController)

module.exports = app
