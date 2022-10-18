const Trainer = require('../models/personalTrainerModel')
const Consumer = require('../models/consumerModel')
const AppError = require('../utils/AppError')
const crypto = require('crypto')

exports.updateTrainer = async (req, res, next) => {
    try {
        const { id } = req.params
        const updateTrainer = Trainer.update(req.body, { where: { id } })
        res.status(200).json({ updateTrainer })
    } catch (error) {
        next(new AppError(error.message, 404))
    }
}

exports.getConsumers = async (req, res, next) => {
    try {
        const userId = req.user.id
        const trainer = await Trainer.findOne({ where: { userId }, include: Consumer })

        res.status(200).json({
            status: 'success',
            data: { consumers: trainer.consumers },
        })
    } catch (error) {
        next(new AppError(error.message, 404))
    }
}

exports.bindConsumer = async (req, res, next) => {
    try {
        const { linkToken } = req.body
        const userId = req.user.id
        const consumer = await Consumer.findOne({ where: { userId } })
        const hashToken = crypto.createHash('sha256').update(linkToken).digest('hex')
    } catch (error) {
        next(new AppError(error.message, 404))
    }
}
