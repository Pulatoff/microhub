// models
const ProgramConsumer = require('../models/ProgramConsumer')
const Consumer = require('../models/consumerModel')
// utils
const AppError = require('../utils/AppError')
const CatchError = require('../utils/catchErrorAsyncFunc')
const response = require('../utils/response')

exports.bindConumer = CatchError(async (req, res, next) => {
    const { programId, consumerId } = req.body
    const consumer = await Consumer.findByPk(consumerId)

    if (!consumer) next(new AppError('This consumer is not exist'))
    await ProgramConsumer.create({ programId, consumerId })

    response(200, 'You are successfuly binded to program', true, '', res)
})
