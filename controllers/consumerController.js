//models
const Consumer = require('../models/consumerModel')
const ConsumerTrainer = require('../models/consumerTrainer')
const Trainer = require('../models/personalTrainerModel')
const User = require('../models/userModel')
// utils
const CatchError = require('../utils/catchErrorAsyncFunc')
const response = require('../utils/response')
const checkInvate = require('../utils/checkInvate')
const AppError = require('../utils/AppError')

exports.addConsumer = CatchError(async (req, res, next) => {
    const { weight, height, favorite_foods, least_favorite_foods, allergies, preferences, gender, activity_level } =
        req.body
    const consumer = await Consumer.create({
        weight,
        height,
        favorite_foods,
        least_favorite_foods,
        allergies,
        preferences,
        gender,
        userId: req.user.id,
        activity_level,
    })

    const { invitationToken } = req.cookies
    if (invitationToken) {
        await checkInvate({ consumerId: consumer.id, invitationToken })
    }

    response(200, 'adding consumer successfuly', true, { consumer }, res)
})

exports.getConsumer = CatchError(async (req, res, next) => {
    response(200, 'Successfuly geting consumer', true, { consumer: req.consumer }, res)
})

exports.updateConsumer = CatchError(async (req, res, next) => {
    const consumer = await Consumer.findByPk(req.consumer.id)
    const { weight, height, favorite_foods, least_favorite_foods, allergies, preferences, gender, activity_level } =
        req.body

    consumer.height = height || consumer.height
    consumer.weight = weight || consumer.weight
    consumer.favorite_foods = favorite_foods || consumer.favorite_foods
    consumer.least_favorite_foods = least_favorite_foods || consumer.least_favorite_foods
    consumer.allergies = allergies || consumer.allergies
    consumer.preferences = preferences || consumer.preferences
    consumer.gender = gender || consumer.gender
    consumer.activity_level = activity_level || consumer.activity_level
    await consumer.save({ validate: true })

    response(203, 'You are successfully update data', true, { consumer }, res)
})

exports.getTrainers = CatchError(async (req, res, next) => {
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

    response(200, 'Successfully geting own nutritionists', true, { nutritionists }, res)
})

exports.protectConsumer = CatchError(async (req, res, next) => {
    const consumer = await Consumer.findOne({ where: { userId: req.user.id } })
    if (!consumer) next(new AppError('You need enter some options for doing this work!'))
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
