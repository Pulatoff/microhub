const Sequelize = require('sequelize')
const Op = Sequelize.Op
// models
const ConsumerTrainer = require('../models/consumerTrainer')
const Trainer = require('../models/personalTrainerModel')
const Consumer = require('../models/consumerModel')
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
    const nutritioinsts = await Trainer.findAll({ where: { [Op.like]: '%' + search + '%' } })
    response(200, 'Your searched nutritionists', true, { nutritioinsts }, res, nutritioinsts.length)
})
