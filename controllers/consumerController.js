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
        console.log(error.message)
        res.status(404).json({
            status: 'failed',
            message: error.message,
        })
    }
}

exports.getConsumer = async (req, res, next) => {
    const consumer = await Consumer.findOne({ where: { userIdId: req.user.id } })
    res.status(200).json({
        status: 'success',
        data: {
            consumer,
        },
    })
}

exports.updateConsumer = async (req, res, next) => {
    try {
        const consumer = await Consumer.update(req.body, { where: { userIdId: req.user.id } })
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

exports.getTrainers = async (req, res, next) => {
    try {
        const userIdId = req.user.id
        const consumer = await Consumer.findOne({ where: { userIdId }, include: Trainer })
        res.status(200).json({
            status: 'success',
            data: { trainers: consumer.personal_trainers },
        })
    } catch (error) {
        next(new AppError(error.message, 404))
    }
}
