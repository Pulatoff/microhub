// models
const Trainer = require('../models/personalTrainerModel')
const Consumer = require('../models/consumerModel')
const User = require('../models/userModel')
const ConsumerTrainer = require('../models/consumerTrainer')
// utils
const AppError = require('../utils/AppError')
const CatchError = require('../utils/catchErrorAsyncFunc')
const response = require('../utils/response')

exports.updateTrainer = async (req, res, next) => {
    try {
        const { id } = req.params
        const updateTrainer = Trainer.update(req.body, { where: { id } })
        res.status(200).json({ updateTrainer })
    } catch (error) {
        next(new AppError(error.message, 404))
    }
}

exports.getConsumers = async (req, res, next) => {
    try {
        const userId = req.user.id
        const trainer = await Trainer.findOne({ where: { userId }, include: Consumer })

        res.status(200).json({
            status: 'success',
            data: { consumers: trainer.consumers },
        })
    } catch (error) {
        next(new AppError(error.message, 404))
    }
}

exports.bindConsumer = async (req, res, next) => {
    try {
        // const { linkToken } = req.body
        // const userId = req.user.id
        // const consumer = await Consumer.findOne({ where: { userId } })
        // const hashToken = crypto.createHash('sha256').update(linkToken).digest('hex')
    } catch (error) {
        next(new AppError(error.message, 404))
    }
}

exports.getAcceptConsumer = CatchError(async (req, res) => {
    let consumers = await Consumer.findAll({
        include: [
            { model: Trainer, where: { userId: req.user.id } },
            { model: User, attributes: ['id', 'first_name', 'last_name', 'email', 'createdAt'] },
        ],
    })
    if (consumers) {
        consumers = consumers.map((val) => {
            if (val.nutritionists[0].consumer_trainers.status === 0) {
                return val
            }
        })
    } else {
        consumers = []
    }
    response(200, 'successful get consumers', true, { consumers }, res)
})

exports.acceptConsumer = CatchError(async (req, res) => {
    const { consumerId } = req.body
    await ConsumerTrainer.findOne({ where: { consumerId } })
    response(200, 'consumer accepted', true, '', res)
})
