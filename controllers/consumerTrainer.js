const ConsumerTrainer = require('../models/consumerTrainer')
const Consumer = require('../models/consumerModel')
const AppError = require('../utils/AppError')

exports.bindConsumer = async (req, res, next) => {
    try {
        const { trainerId } = req.body
        const userIdId = req.user.id
        const consumer = await Consumer.findOne({ where: { userIdId } })
        await ConsumerTrainer.create({ consumer: consumer.id, trainer: trainerId })
        res.status(200).json({
            status: 'success',
            data: {},
        })
    } catch (error) {
        console.log(error)
        next(new AppError(error.message, 404))
    }
}
