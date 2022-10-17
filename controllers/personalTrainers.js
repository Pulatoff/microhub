const Trainer = require('../models/personalTrainerModel')
const User = require('../models/userModel')
const Consumer = require('../models/consumerModel')
const Program = require('../models/programModel')
const AppError = require('../utils/AppError')

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
