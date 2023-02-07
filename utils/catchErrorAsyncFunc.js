const AppError = require('./AppError')

const CatchError = (func) => {
    return (req, res, next) => func(req, res, next).catch((error) => next(new AppError(error.message, 400)))
}

module.exports = CatchError
