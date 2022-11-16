// models
const ProgramConsumer = require('../models/ProgramConsumer')
const Consumer = require('../models/consumerModel')
const ConsumerTrainer = require('../models/consumerTrainer')
// utils
const AppError = require('../utils/AppError')
const CatchError = require('../utils/catchErrorAsyncFunc')
const response = require('../utils/response')

exports.bindConumer = CatchError(async (req, res, next) => {
    const { programId, consumerId } = req.body
    const consumer = await Consumer.findByPk(consumerId)
    const checkRef = await ConsumerTrainer.findOne({ where: { consumerId, nutritionistId } })
    if (checkRef) next(new AppError('This consumer already binded', 404))

    if (!consumer) next(new AppError('This consumer is not exist', 404))
    await ProgramConsumer.create({ programId, consumerId })

    response(200, 'You are successfuly binded to program', true, '', res)
})
