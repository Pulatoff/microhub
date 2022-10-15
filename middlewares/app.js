const express = require('express')
const app = express()
const userRouter = require('../routes/authRouter')
const consumerRouter = require('../routes/consumerRoutes')
const programRouter = require('../routes/programRouter')
const errorController = require('../controllers/errorController')
const AppError = require('../utils/AppError')
const TrainerRouter = require('../routes/trainerRouter')
const DairyController = require('../routes/dairyRouter')
const GoalsRouter = require('../routes/goalRoutes')

app.use(express.json())

app.use('/api/v1/users', userRouter)
app.use('/api/v1/consumers', consumerRouter)
app.use('/api/v1/programs', programRouter)
app.use('/api/v1/trainers', TrainerRouter)
app.use('/api/v1/daires', DairyController)
app.use('/api/v1/goals', GoalsRouter)
app.all('*', (req, res, next) => {
    next(new AppError('Page not Found', 404))
})

app.use(errorController)

module.exports = app
