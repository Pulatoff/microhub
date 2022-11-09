//models
const Consumer = require('../models/consumerModel')
const ConsumerTrainer = require('../models/consumerTrainer')
const Trainer = require('../models/personalTrainerModel')
const User = require('../models/userModel')
const AppError = require('../utils/AppError')
// utils
const CatchError = require('../utils/catchErrorAsyncFunc')
const response = require('../utils/response')
const checkInvate = require('../utils/checkInvate')

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
    const { invintationToken } = req.cookies

    if (invintationToken) {
        checkInvate({ consumerId: consumer.id, invintationToken: req.cookies.invintationToken })
    }

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
    const consumer = await Consumer.findOne({ where: { userId: req.user.id } })
    if (!consumer) next(new AppError('You need enter some options for doing this work'))
    req.consumer = consumer
    next()
})

exports.acceptNutritioinst = CatchError(async (req, res, next) => {
    const { nutritionistId } = req.body
    const nutritionist = await Trainer.findByPk(nutritionistId)
    if (!nutritionist) next(new AppError('This nutritionist is not exist!', 404))
    const updateModel = await ConsumerTrainer.findOne({
        where: { nutritionistId, consumerId: req.consumer.id, status: 0 },
    })
    if (!updateModel) next(new AppError('this requested nutritionist not found', 404))
    updateModel.status = 1
    await updateModel.save()
    response(200, 'Nutritioinst successfully binded to consumer', true.valueOf, '', res)
})
