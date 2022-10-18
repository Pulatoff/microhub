const Consumer = require('../models/consumerModel')
const Program = require('../models/programModel')
const Trainer = require('../models/personalTrainerModel')
const AppError = require('../utils/AppError')

exports.addConsumer = async (req, res, next) => {
    try {
        const { weight, height, favorite_foods, least_favorite_foods, allergies, preferences, gender } = req.body
        const consumer = await Consumer.create({
            weight,
            height,
            favorite_foods,
            least_favorite_foods,
            allergies,
            preferences,
            gender,
            userIdId: req.user.id,
        })
        res.status(200).json({
            status: 'success',
            data: {
                consumer,
            },
        })
    } catch (error) {
        res.status(404).json({
            status: 'failed',
            message: error.message,
        })
    }
}

exports.getConsumer = async (req, res, next) => {
    try {
        res.status(200).json({
            status: 'success',
            data: {
                consumer: req.consumer,
            },
        })
    } catch (error) {
        next(new AppError(error.message, 404))
    }
}

exports.updateConsumer = async (req, res, next) => {
    try {
        const consumer = await Consumer.update(req.body, { where: { userId: req.user.id }, returning: true })
        res.status(200).json({
            status: 'success',
            data: {
                consumer,
            },
        })
    } catch (error) {
        next(new AppError(error.message, 404))
    }
}

exports.getTrainers = async (req, res, next) => {
    try {
        const userId = req.user.id
        const consumer = await Consumer.findOne({ where: { userId }, include: Trainer })
        res.status(200).json({
            status: 'success',
            data: { trainers: consumer.personal_trainers },
        })
    } catch (error) {
        next(new AppError(error.message, 404))
    }
}
