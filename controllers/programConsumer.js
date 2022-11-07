const ProgramConsumer = require('../models/ProgramConsumer')
const AppError = require('../utils/AppError')
const Consumer = require('../models/consumerModel')
const CatchError = require('../utils/catchErrorAsyncFunc')

exports.bindConumer = async (req, res, next) => {
    try {
        const { programId, consumerId } = req.body
        const consumer = await Consumer.findByPk(consumerId)

        if (!consumer) next(new AppError('This consumer is not exist'))
        await ProgramConsumer.create({ programId, consumerId })

        res.json({
            data: '',
            status: 'success',
        })
    } catch (error) {
        next(new AppError(error.message, 403))
    }
}
