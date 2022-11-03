// models
const ConsumerTrainer = require('../models/consumerTrainer')
const Trainer = require('../models/personalTrainerModel')
// utils
const AppError = require('../utils/AppError')

exports.bindConsumer = async (req, res, next) => {
    try {
        const { nutritionistId } = req.body
        const trainer = await Trainer.findByPk(nutritionistId)

        if (!trainer) next(new AppError('This trainer is not exist', 404))
        console.log(req.consumer)
        await ConsumerTrainer.create({ consumerId: req.consumer.id, nutritionistId: trainer.id })

        res.status(200).json({
            status: 'success',
            data: '',
        })
    } catch (error) {
        next(new AppError(error.message, 404))
    }
}
