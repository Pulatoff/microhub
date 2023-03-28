class AppError extends Error {
    constructor(message, statusCode = 400) {
        super(message)
        this.statusCode = statusCode
        this.status = this.statusCode === 400 ? 'failed' : 'error'
        Error.captureStackTrace(this, this.consturctor)
        return this
    }
}

module.exports = AppError
