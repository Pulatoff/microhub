module.exports = (error, req, res, next) => {
    error.message = error.message || 'not found'
    error.statusCode = error.statusCode || 404
    if (process.env.NODE_ENV === 'development') {
        res.status(error.statusCode).json({
            message: error.message,
            status: error.status,
            stack: error.stack,
        })
    } else {
        res.status(error.statusCode).json({
            message: error.message,
            status: error.status,
        })
    }
}
