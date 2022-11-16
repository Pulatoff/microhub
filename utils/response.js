const response = (statusCode, message, isOk, data, res, results) => {
    const status = 'success'
    if (results) {
        res.status(statusCode).json({ status: status, message: message, isOk: isOk, data: data, results })
    } else {
        res.status(statusCode).json({ status: status, message: message, isOk: isOk, data: data })
    }
}

module.exports = response
