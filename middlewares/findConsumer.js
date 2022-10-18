const Consumer = require('../models/consumerModel')

module.exports = async (req, res, next) => {
    const userId = req.user.id
    const consumer = await Consumer.findOne({ where: { userId } })
    req.consumer = consumer
    next()
}
