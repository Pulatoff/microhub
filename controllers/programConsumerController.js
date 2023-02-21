// models
const ProgramConsumer = require('../models/programConsumerModel')
const Consumer = require('../models/consumerModel')
const ConsumerTrainer = require('../models/consumerTrainerModel')
const Trainer = require('../models/personalTrainerModel')
const Program = require('../models/programModel')
const User = require('../models/userModel')
const ProgramTime = require('../models/programTimeModel')
const Meal = require('../models/mealModel')

// utils
const AppError = require('../utils/AppError')
const CatchError = require('../utils/catchErrorAsyncFunc')
const response = require('../utils/response')

exports.bindConumer = CatchError(async (req, res, next) => {
    const { programId, consumerId } = req.body
    const userId = req.user.id
    const consumer = await Consumer.findByPk(consumerId)
    const nutritionist = await Trainer.findOne({ where: { userId } })
    const checkRef = await ConsumerTrainer.findOne({
        where: { consumerId, nutritionistId: nutritionist.id, status: 2 },
    })
    if (!consumer) next(new AppError('This consumer is not exist', 404))
    if (!checkRef) {
        next(new AppError(`Client by id ${consumerId} not assigned to nutritionist`, 404))
    } else {
        checkRef.statusClient = 'active'
        await checkRef.save()
        await ProgramConsumer.create({ programId, consumerId })
    }
    response(200, 'You are successfuly binded to program', true, '', res)
})

exports.getPrograms = CatchError(async (req, res, next) => {
    const userId = req.user.id
    const consumer = await Consumer.findOne({
        where: { userId },
        include: [
            {
                model: Program,
                include: [
                    { model: Trainer, include: [{ model: User }] },
                    { model: ProgramTime, include: [{ model: Meal }] },
                ],
            },
        ],
    })

    response(200, 'You successfully got assign programs', true, { programs: consumer.programs }, res)
})

exports.bindConumerSelf = CatchError(async (req, res, next) => {
    const { programId } = req.body
    const userId = req.user.id
    const consumer = await Consumer.findByPk({ where: { userId } })

    if (!consumer) next(new AppError('This consumer is not exist', 400))

    await ProgramConsumer.create({ programId, consumerId: consumer.id })
    consumer.program_id = programId
    await consumer.save()

    response(200, 'You are successfuly binded to program', true, '', res)
})
