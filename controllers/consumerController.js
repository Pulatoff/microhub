const Consumer = require('../models/consumerModel')
const Program = require('../models/programModel')
const ConsumerTrainer = require('../models/consumerTrainer')
const Trainer = require('../models/personalTrainerModel')
const AppError = require('../utils/AppError')
const User = require('../models/userModel')
exports.addConsumer = async (req, res, next) => {
    try {
        const { weight, height, favorite_foods, least_favorite_foods, allergies, preferences, gender } = req.body
        const consumer = await Consumer.create({
            weight,
            height,
            favorite_foods,
            least_favorite_foods,
            allergies,
            preferences,
            gender,
            userIdId: req.user.id,
        })
        res.status(200).json({
            status: 'success',
            data: {
                consumer,
            },
        })
    } catch (error) {
        console.log(error.message)
        res.status(404).json({
            status: 'failed',
            message: error.message,
        })
    }
}

exports.getConsumer = async (req, res, next) => {
    const consumer = await Consumer.findOne({ where: { userIdId: req.user.id } })
    const newPrograms = []
    if (consumer.programs) {
        const newArray = consumer.programs.map(async (val) => {
            const program = await Program.findByPk(val)
            return program
        })
    }
    consumer.programs = []
    res.status(200).json({
        status: 'success',
        data: {
            consumer,
        },
    })
}

exports.updateConsumer = async (req, res, next) => {
    try {
        const consumer = await Consumer.update(req.body, { where: { userIdId: req.user.id } })
        res.status(200).json({
            status: 'success',
            data: {
                consumer,
            },
        })
    } catch (error) {
        res.status(404).json({
            status: 'failed',
            message: error.message,
        })
    }
}

exports.getTrainers = async (req, res, next) => {
    try {
        const userIdId = req.user.id
        const consumer = await Consumer.findOne({ where: { userIdId } })
        const trainers = await ConsumerTrainer.findAll({ where: { consumer: consumer.id } })
        const newTrainers = []
        for (let i = 0; i < trainers.length; i++) {
            const trainer = await Trainer.findByPk(trainers[i].trainer, { include: [{ model: User, as: 'user' }] })
            newTrainers.push(trainer)
        }
        res.status(200).json({
            status: 'success',
            data: { trainers: newTrainers },
        })
    } catch (error) {
        console.log(error)
        next(new AppError(error.message, 404))
    }
}
