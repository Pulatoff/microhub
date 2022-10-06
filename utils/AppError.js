class AppError extends Error {
    constructor(message, statusCode) {
        this.message = message
        this.statusCode = statusCode
        this.status = this.statusCode === 404 ? 'failed' : 'error'
    }
}
