const Consumer = require('../models/consumerModel')
const Trainer = require('../models/personalTrainerModel')
const AppError = require('../utils/AppError')
const User = require('../models/userModel')

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
            userId: req.user.id,
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
        const consumer = await Consumer.findOne({ where: { userId }, include: [{ model: Trainer, include: User }] })

        const nutrisionists = consumer.nutritionists.map((val, key) => {
            console.log(val)
            return {
                id: val.id,
                first_name: val.user.first_name,
                last_name: val.user.last_name,
                photo: val.user.photo,
                email: val.user.email,
                linkToken: val.linkToken,
                createdAt: val.createdAt,
            }
        })
        res.status(200).json({
            status: 'success',
            data: { trainers: nutrisionists },
        })
    } catch (error) {
        next(new AppError(error.message, 404))
    }
}
