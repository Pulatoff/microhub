const Sequelize = require('sequelize')
const Op = Sequelize.Op
// models
const ConsumerTrainer = require('../models/consumerTrainer')
const Trainer = require('../models/personalTrainerModel')
const Consumer = require('../models/consumerModel')
const User = require('../models/userModel')
// utils
const AppError = require('../utils/AppError')
const CatchError = require('../utils/catchErrorAsyncFunc')
const response = require('../utils/response')
const countClientStats = require('../utils/clientStats')

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
    if (!consumer) next(new AppError('This consumer is not exist', 404))
    await ConsumerTrainer.create({ consumerId, nutritionistId: req.nutritionist.id })
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
