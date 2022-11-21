// models
const ProgramConsumer = require('../models/ProgramConsumer')
const Consumer = require('../models/consumerModel')
const ConsumerTrainer = require('../models/consumerTrainer')
const Trainer = require('../models/personalTrainerModel')
// utils
const AppError = require('../utils/AppError')
const CatchError = require('../utils/catchErrorAsyncFunc')
const response = require('../utils/response')

exports.bindConumer = CatchError(async (req, res, next) => {
    const { programId, consumerId } = req.body
    const userId = req.user.id
    const consumer = await Consumer.findByPk(consumerId)
    const nutritionist = await Trainer.findOne({ where: { userId } })
    const checkRef = await ConsumerTrainer.findOne({ where: { consumerId, nutritionistId: nutritionist.id } })
    if (!checkRef) next(new AppError('This consumer already binded', 404))

    if (!consumer) next(new AppError('This consumer is not exist', 404))
    await ProgramConsumer.create({ programId, consumerId })
    checkRef.statusClient = 'active'
    await checkRef.save()
    response(200, 'You are successfuly binded to program', true, '', res)
})
