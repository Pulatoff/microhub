//models
const Consumer = require('../models/consumerModel')
const Trainer = require('../models/personalTrainerModel')
const User = require('../models/userModel')
// utils
const CatchError = require('../utils/catchErrorAsyncFunc')

exports.addConsumer = CatchError(async (req, res, next) => {
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
})

exports.getConsumer = CatchError(async (req, res, next) => {
    res.status(200).json({
        status: 'success',
        data: {
            consumer: req.consumer,
        },
    })
})

exports.updateConsumer = CatchError(async (req, res, next) => {
    const consumer = await Consumer.update(req.body, { where: { userId: req.user.id }, returning: true })
    res.status(200).json({
        status: 'success',
        data: {
            consumer,
        },
    })
})

exports.getTrainers = CatchError(async (req, res, next) => {
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
})
