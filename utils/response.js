const response = (statusCode, message, isOk, data, res) => {
    const status = 'success'
    res.status(statusCode).json({ status: status, message: message, isOk: isOk, data: data })
}

module.exports = response
