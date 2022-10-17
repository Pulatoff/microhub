const ConsumerTrainer = require('../models/consumerTrainer')
const Consumer = require('../models/consumerModel')
const AppError = require('../utils/AppError')
const Trainer = require('../models/personalTrainerModel')

exports.bindConsumer = async (req, res, next) => {
    try {
        const { trainerId } = req.body
        const userIdId = req.user.id
        const consumer = await Consumer.findOne({ where: { userIdId } })
        const trainer = await Trainer.findByPk(trainerId)

        if (!trainer) next(new AppError('This trainer is not exist', 404))

        await ConsumerTrainer.create({ consumerId: consumer.id, personalTrainerId: trainer.id })

        res.status(200).json({
            status: 'success',
            data: '',
        })
    } catch (error) {
        next(new AppError(error.message, 404))
    }
}
