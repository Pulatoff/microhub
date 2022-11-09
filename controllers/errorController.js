module.exports = (error, req, res) => {
    error.message = error.message || 'not found'
    error.statusCode = error.statusCode || 404
    if (process.env.NODE_ENV === 'development') {
        res.status(error.statusCode).json({
            message: error.message,
            isOk: false,
            status: error.status,
            data: '',
            stack: error.stack,
        })
    } else {
        res.status(error.statusCode).json({
            message: error.message,
            isOk: false,
            data: '',
            status: error.status,
        })
    }
}
