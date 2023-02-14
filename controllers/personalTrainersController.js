// models
const Trainer = require('../models/personalTrainerModel')
const Consumer = require('../models/consumerModel')
const User = require('../models/userModel')
const ConsumerTrainer = require('../models/consumerTrainerModel')
const ConsumerDetails = require('../models/consumerDetailsModel')
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

exports.getConsumers = CatchError(async (req, res) => {
    const userId = req.user.id
    const trainer = await Trainer.findOne({
        where: { userId },
        include: [
            {
                model: Consumer,
                include: [
                    { model: User, attributes: { exclude: ['password', 'isActive'] } },
                    { model: ConsumerDetails },
                ],
            },
        ],
    })

    const consumers = []
    trainer.consumers = trainer?.consumers?.map((e) => {
        if (e?.consumer_trainers.status === 2) {
            console.log
            consumers.push(e)
        }
    })

    response(200, 'consumers already geted', true, { consumers }, res)
})

exports.inviteConsumer = CatchError(async (req, res, next) => {
    const { linkToken } = req.params
    const trainer = await Trainer.findOne({ where: { linkToken } })
    if (!trainer) next(new AppError('this url is not found', 404))
    res.cookie('invitationToken', linkToken, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'none',
        secure: true,
    })
    response(200, 'you invited by nutritionist', true, { nutritionist: trainer }, res)
})

exports.getAcceptConsumer = CatchError(async (req, res) => {
    let consumers = await Consumer.findAll({
        include: [
            { model: Trainer, where: { userId: req.user.id } },
            { model: User, attributes: ['id', 'first_name', 'last_name', 'email', 'createdAt'] },
        ],
    })

    if (consumers) {
        consumers = consumers.map((val) => {
            if (val.nutritionists[0].consumer_trainers.status === 1) {
                val.nutritionists = {}
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
    const trainer = await Trainer.findOne({ where: { userId: req.user.id } })
    const consumerTrainer = await ConsumerTrainer.findOne({
        where: { consumerId, nutritionistId: trainer.id, status: 1 },
    })
    if (!consumerTrainer) {
        next('request went wrong', 404)
    }
    consumerTrainer.status = 2
    await consumerTrainer.save()
    response(206, 'consumer accepted', true, '', res)
})
