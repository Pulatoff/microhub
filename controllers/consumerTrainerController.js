const Sequelize = require('sequelize')
// models
const ConsumerTrainer = require('../models/consumerTrainerModel')
const Trainer = require('../models/personalTrainerModel')
const Consumer = require('../models/consumerModel')
const User = require('../models/userModel')
const Program = require('../models/programModel')
const Questionnaire = require('../models/questionnaireModel')
// utils
const AppError = require('../utils/AppError')
const CatchError = require('../utils/catchErrorAsyncFunc')
const response = require('../utils/response')
const countClientStats = require('../utils/clientStats')
const QuestionnaireQuestion = require('../models/questionnariesQuestionModel')

exports.bindConsumer = CatchError(async (req, res, next) => {
    const { nutritionistId } = req.body
    const trainer = await Trainer.findByPk(nutritionistId)
    if (!trainer) next(new AppError('This nutritionist is not exist', 404))

    await ConsumerTrainer.create({ consumerId: req.consumer.id, nutritionistId: trainer.id })
    response(206, 'you successfuly requested binding to nutritioinst', true, '', res)
})

exports.bindNutritionist = CatchError(async (req, res, next) => {
    const { consumerId } = req.body

    const consumer = await Consumer.findByPk(consumerId)
    const trainer = await Trainer.findOne({ where: { userId: req.user.id } })
    if (!trainer) next(new AppError('this nutritionist is not exist', 404))
    if (!consumer) next(new AppError('This consumer is not exist', 404))
    const reference = await ConsumerTrainer.findOne({ where: { consumerId, nutritionistId: trainer.id } })
    if (!reference) {
        await ConsumerTrainer.create({ consumerId, nutritionistId: trainer.id, invate_side: 'profesional' })
    } else if (reference.status === -1) {
        reference.status = 0
        await reference.save()
    } else if (reference.status === 0) {
        reference.status = 0
        await reference.save()
    } else {
        next(
            new AppError(`Nutritioninst and Client by ids ${trainer.id} and ${consumer.id} already assigned each other`)
        )
    }

    response(206, 'you successfuly requested binding to consumer', true, '', res)
})

exports.getAllConsumerStats = CatchError(async (req, res, next) => {
    const userId = req.user.id
    const nutritionist = await Trainer.findOne({ where: { userId } })
    const ref = await ConsumerTrainer.findAll({ where: { nutritionistId: nutritionist.id } })
    const stats = countClientStats(ref)
    response(200, 'You are successfuly geting stats', true, { stats }, res)
})

exports.searchEngine = CatchError(async (req, res, next) => {
    const { search } = req.query
    const nutritioinst = await Trainer.findOne({
        include: [
            {
                model: User,
                where: { email: search },
                attributes: ['first_name', 'last_name', 'email', 'role'],
            },
        ],
        attributes: ['id', 'linkToken', 'createdAt'],
    })
    if (!nutritioinst) next(new AppError(`profesional by this email:${search} not found`, 404))

    response(200, 'Your searched nutritionists', true, { nutritioinst }, res)
})

exports.searchConsumer = CatchError(async (req, res, next) => {
    const { search } = req.query

    const consumer = await Consumer.findOne({
        include: [
            {
                model: User,
                where: { email: search },
                attributes: ['first_name', 'last_name', 'email', 'role'],
            },
        ],
    })
    if (!consumer) next(new AppError(`client by this email:${search} not found`, 404))

    response(200, 'Your searched consumer', true, { consumer }, res)
})

exports.getOneConsumer = CatchError(async (req, res, next) => {
    const { id } = req.params
    const trainer = await Trainer.findOne({ where: { userId: req.user.id } })
    const checkBind = await ConsumerTrainer.findOne({
        where: { consumerId: id, nutritionistId: trainer.id, status: 2 },
    })
    if (!checkBind) next(new AppError('You are not assign this consumer', 404))
    const consumer = await Consumer.findOne({
        where: { id },
        include: [
            { model: User, attributes: { exclude: ['password', 'isActive'] } },
            { model: Program, where: { nutritionistId: trainer.id } },
        ],
    })

    response(200, 'You are successfully got consumer', true, { consumer }, res)
})

/*  # GET /api/v1/trainers/consumers/approve
 *  role: nutritionist
 */
exports.getSendedQuestionnaire = CatchError(async (req, res, next) => {
    const userId = req.user.id
    const trainer = await Trainer.findOne({
        where: { userId },
        include: [{ model: Consumer, include: [{ model: User, attributes: { exclude: ['password', 'isActive'] } }] }],
    })
    const consumers = []
    for (let i = 0; i < trainer.consumers.length; i++) {
        const consumer = trainer.consumers[i]
        if (consumer.consumer_trainers.status === 1) {
            const questionaire = await Questionnaire.findOne({
                where: { nutritionistId: trainer.id, consumerId: consumer.id },
                include: QuestionnaireQuestion,
            })

            const obj = {
                id: consumer.id,
                favorite_foods: consumer.favorite_foods,
                least_favorite_foods: consumer.least_favorite_foods,
                allergies: consumer.allergies,
                weight: consumer.weight,
                height: consumer.height,
                wrist: consumer.wrist,
                forearm: consumer.forearm,
                waist: consumer.waist,
                hip: consumer.hip,
                user: consumer.user,
                questionaire,
                gender: consumer.gender,
                activity_level: consumer.activity_level,
                preferences: consumer.preferences,
                body_fat: consumer.body_fat,
                tdee: consumer.tdee,
                body_frame: consumer.body_frame,
                healthy_weight: consumer.healthy_weight,
                bmi: consumer.bmi,
                daily_targets: consumer.daily_targets,
            }

            consumers.push(obj)
        }
    }

    response(200, 'you successfully get consumers', true, { consumers }, res)
})

exports.approveConsumer = CatchError(async (req, res, next) => {
    const { consumerId, status } = req.body
    const userId = req.user.id
    const trainer = await Trainer.findOne({ where: { userId } })
    const consumerTrainer = await ConsumerTrainer.findOne({
        where: { nutritionistId: trainer.id, consumerId, status: 1 },
    })

    if (!consumerTrainer) {
        next(new AppError('This consumer dont send questionnaire', 400))
    } else {
        consumerTrainer.status = status
        await consumerTrainer.save()
        if (status === 2) {
            response(200, 'You are successfully approved consumer', true, '', res)
        } else if (status === -1) {
            response(200, 'You are successfully rejected consumer', true, '', res)
        }
    }
})
