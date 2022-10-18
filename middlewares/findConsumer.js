const Consumer = require('../models/consumerModel')
const AppError = require('../utils/AppError')

module.exports = async (req, res, next) => {
    try {
        const userId = req.user.id
        const consumer = await Consumer.findOne({ where: { userId } })
        req.consumer = consumer
        next()
    } catch (error) {
        next(new AppError(error.message, 404))
    }
}
