const ConsumerTrainer = require('../models/consumerTrainer')
const Consumer = require('../models/consumerModel')
const AppError = require('../utils/AppError')
const Trainer = require('../models/personalTrainerModel')

exports.bindConsumer = async (req, res, next) => {
    try {
        const { trainerId, userId: userIdId } = req.body
        console.log(userIdId)
        const consumer = await Consumer.findOne({ where: { userIdId } })
        const trainer = await Trainer.findByPk(trainerId)
        await ConsumerTrainer.create({ consumerId: consumer.id, personalTrainerId: trainer.id })
        const bindConsumer = await Consumer.findByPk(consumer.id, {
            include: Trainer,
        })
        res.status(200).json({
            status: 'success',
            data: bindConsumer,
        })
    } catch (error) {
        console.log(error)
        next(new AppError(error.message, 404))
    }
}
