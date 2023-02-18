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

function ConsumerType(consumer) {
    return {
        id: consumer.id,
        weight: consumer.weight,
        height: consumer.height,
        wrist: consumer.wrist,
        forearm: consumer.forearm,
        hip: consumer.hip,
        gender: consumer.gender,
        activity_level: consumer.activity_level,
        preferences: consumer.preferences,
        least_favorite_foods: consumer.least_favorite_foods,
        favorite_foods: consumer.favorite_foods,
        allergies: consumer.allergies,
        body_fat: consumer.body_fat,
        tdee: consumer.tdee,
        body_frame: consumer.body_frame,
        healthy_weight: consumer.healthy_weight,
        bmi: consumer.bmi,
        daily_targets: consumer.daily_targets,
        consumer_details: consumer?.consumer_details,
        user: consumer?.user,
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
            const consumer = ConsumerType(e)
            consumer.room = e.consumer_trainers.room_number
            consumers.push(consumer)
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
