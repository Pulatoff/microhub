//models
const Consumer = require('../models/consumerModel')
const Trainer = require('../models/personalTrainerModel')
const User = require('../models/userModel')
const AppError = require('../utils/AppError')
// utils
const CatchError = require('../utils/catchErrorAsyncFunc')
const response = require('../utils/response')

exports.addConsumer = CatchError(async (req, res) => {
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

    response(200, 'adding consumer successfuly', true, { consumer }, res)
})

exports.getConsumer = CatchError(async (req, res) => {
    res.status(200).json({ status: 'success', data: { consumer: req.consumer } })
})

exports.updateConsumer = CatchError(async (req, res) => {
    const consumer = await Consumer.update(req.body, { where: { userId: req.user.id }, returning: true })
    res.status(200).json({ status: 'success', data: { consumer } })
})

exports.getTrainers = CatchError(async (req, res) => {
    const userId = req.user.id
    const consumer = await Consumer.findOne({ where: { userId }, include: [{ model: Trainer, include: User }] })

    const nutritionists = consumer.nutritionists.map((val) => {
        return {
            id: val.id,
            first_name: val.user.first_name,
            last_name: val.user.last_name,
            photo: val.user.photo,
            email: val.user.email,
            linkToken: val.linkToken,
            status: val.consumer_trainers.status,
            createdAt: val.createdAt,
        }
    })

    res.status(200).json({ status: 'success', data: { nutritionists } })
})

exports.protectConsumer = CatchError(async (req, res, next) => {
    const consumer = await Consumer.findOne({ userId: req.user.id })
    if (!consumer) next(new AppError('You need enter some options for doing this work'))
    req.consumer = consumer
    next()
})
