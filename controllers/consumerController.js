//models
const Consumer = require('../models/consumerModel')
const Trainer = require('../models/personalTrainerModel')
const User = require('../models/userModel')
const Program = require('../models/programModel')
const Meal = require('../models/mealModel')
const ProgramTime = require('../models/programTimeModel')
const ConsumerTrainer = require('../models/consumerTrainerModel')
// utils
const CatchError = require('../utils/catchErrorAsyncFunc')
const response = require('../utils/response')
const checkInvate = require('../utils/checkInvate')
const AppError = require('../utils/AppError')

const resConsumerType = (consumer) => {
    return {
        id: consumer.id,
        height: consumer.height,
        weight: consumer.weight,
        favorite_foods: consumer.favorite_foods,
        least_favorite_foods: consumer.least_favorite_foods,
        allergies: consumer.allergies,
        preferences: consumer.preferences,
        hip: consumer.hip,
        forearm: consumer.forearm,
        wrist: consumer.wrist,
        waist: consumer.waist,
        user: consumer.user,
    }
}

exports.addConsumer = CatchError(async (req, res, next) => {
    const {
        weight,
        height,
        favorite_foods,
        least_favorite_foods,
        allergies,
        preferences,
        gender,
        activity_level,
        wrist,
        forearm,
        hip,
        waist,
    } = req.body

    const oldConsumer = await Consumer.findOne({ where: { userId: req.user.id } })
    if (oldConsumer) next(new AppError('This consumer details already exists', 403))

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
        wrist,
        waist,
        hip,
        forearm,
    })

    const { invitationToken } = req.cookies
    if (invitationToken) {
        await checkInvate({ consumerId: consumer.id, invitationToken })
    }

    response(201, 'You are add consumer details successfully', true, { consumer }, res)
})

exports.getConsumers = CatchError(async (req, res, next) => {
    const userId = req.user.id
    const trainer = await Trainer.findOne({ where: { userId } })
    if (!trainer) next(new AppError('Nutritionist not exist', 404))

    const consumers = await Consumer.findAll({
        include: [
            {
                model: Program,
                where: { nutritionistId: trainer.id },
                include: [{ model: ProgramTime, include: [{ model: Meal }] }],
            },
            { model: User, attributes: ['id', 'first_name', 'last_name', 'email', 'role', 'photo', 'createdAt'] },
        ],
    })
    const newConsumers = []
    for (let i = 0; i <= consumers.length - 1; i++) {
        const newUser = {
            favorite_foods: consumers[i].favorite_foods,
            least_favorite_foods: consumers[i].least_favorite_foods,
            allergies: consumers[i].allergies,
            body_fat: consumers[i].body_fat,
            tdee: consumers[i].tdee,
            body_frame: consumers[i].body_frame,
            healthy_weight: consumers[i].healthy_weight,
            bmi: consumers[i].bmi,
            daily_targets: consumers[i].daily_targets,
            id: consumers[i].id,
            weight: consumers[i].weight,
            height: consumers[i].height,
            wrist: consumers[i].wrist,
            forearm: consumers[i].forearm,
            hip: consumers[i].hip,
            waist: consumers[i].waist,
            gender: consumers[i].gender,
            activity_level: consumers[i].activity_level,
            preferences: consumers[i].preferences,
            createdAt: consumers[i].createdAt,
            program: consumers[i].programs[0] ? consumers[i].programs[0] : {},
            user: consumers[i].user,
        }
        newConsumers.push(newUser)
    }
    response(200, 'Successfuly geting consumer', true, { consumers: newConsumers }, res)
})

exports.updateConsumer = CatchError(async (req, res, next) => {
    const userId = req.user.id

    const consumer = await Consumer.findOne({ where: userId })
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

exports.getRequestedTrainers = CatchError(async (req, res, next) => {
    const userId = req.user.id
    const consumer = await Consumer.findOne({ where: { userId }, include: [{ model: Trainer, include: User }] })

    const nutritionists = consumer.nutritionists.map((val) => {
        if (val.consumer_trainers.status === 0 && val.consumer_trainers?.invate_side === 'profesional') {
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
        }
    })

    response(200, 'Successfully geting own nutritionists', true, { nutritionists }, res)
})

exports.getTrainers = CatchError(async (req, res, next) => {
    const userId = req.user.id
    const consumer = await Consumer.findOne({ where: { userId }, include: [{ model: Trainer, include: User }] })

    const nutritionists = consumer.nutritionists.map((val) => {
        if (val.consumer_trainers.status === 1) {
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
        }
    })

    response(200, 'Successfully geting own nutritionists', true, { nutritionists }, res)
})

exports.protectConsumer = CatchError(async (req, res, next) => {
    const consumer = await Consumer.findOne({ where: { userId: req.user.id } })
    if (!consumer) next(new AppError('You need enter some options for doing this work!', 404))
    req.consumer = consumer
    next()
})

exports.acceptNutritioinst = CatchError(async (req, res, next) => {
    const { nutritionistId, status } = req.body

    const nutritionist = await Trainer.findByPk(nutritionistId)
    if (!nutritionist) next(new AppError('This nutritionist is not exist!', 404))

    const updateModel = await ConsumerTrainer.findOne({
        where: { nutritionistId, consumerId: req.consumer.id, status: 0 },
    })

    if (!updateModel) next(new AppError('this requested nutritionist not found', 404))
    updateModel.status = status
    await updateModel.save()
    if (status === 1) {
        response(206, `Client accept Nutritionist by id ${nutritionistId}`, true, '', res)
    } else {
        response(206, `Client reject Nutritionist by id ${nutritionistId}`, true, '', res)
    }
})

exports.getOneConsumer = CatchError(async (req, res, next) => {
    const { id } = req.params
    const userId = req.user.id
    const trainer = await Trainer.findOne({ where: { userId } })
    if (!trainer) next(new AppError('Nutritionist not exist', 404))
    const consumer = await Consumer.findByPk(id, {
        include: [
            { model: User, attributes: ['id', 'first_name', 'last_name', 'email', 'role', 'photo', 'createdAt'] },
            {
                model: Program,
                include: [{ model: ProgramTime, include: [{ model: Meal }] }],
                where: { nutritionistId: trainer.id },
            },
        ],
    })
    const newUser = {
        favorite_foods: consumer.favorite_foods,
        least_favorite_foods: consumer.least_favorite_foods,
        allergies: consumer.allergies,
        body_fat: consumer.body_fat,
        tdee: consumer.tdee,
        body_frame: consumer.body_frame,
        healthy_weight: consumer.healthy_weight,
        bmi: consumer.bmi,
        daily_targets: consumer.daily_targets,
        id: consumer.id,
        weight: consumer.weight,
        height: consumer.height,
        wrist: consumer.wrist,
        forearm: consumer.forearm,
        hip: consumer.hip,
        waist: consumer.waist,
        gender: consumer.gender,
        activity_level: consumer.activity_level,
        preferences: consumer.preferences,
        createdAt: consumer.createdAt,
        program: consumer.programs[0] ? consumer.programs[0] : {},
        user: consumer.user,
    }
    response(200, 'successfully consumer', true, { consumer: newUser }, res)
})
