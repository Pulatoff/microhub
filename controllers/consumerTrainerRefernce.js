// models
const ConsumerTrainer = require('../models/consumerTrainer')
const Trainer = require('../models/personalTrainerModel')
const Consumer = require('../models/consumerModel')
// utils
const AppError = require('../utils/AppError')
const CatchError = require('../utils/catchErrorAsyncFunc')
const response = require('../utils/response')

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
    console.log(stats)
    response(200, 'You are successfuly geting stats', true, { stats }, res)
})

function countClientStats(array) {
    let await_meals = 0
    let active = 0
    let inactive = 0
    for (let i = 0; i < array.length; i++) {
        if (array[i].statusClient === 'active') {
            active++
        } else if (array[i].statusClient === 'inactive') {
            inactive++
        } else if (array[i].statusClient === 'awaiting meals') {
            await_meals++
        } else {
            continue
        }
    }
    return { active: active, inactive: inactive, awaitingMeals: await_meals }
}
