const Goals = require('../models/goalModel')
const AppError = require('../utils/AppError')
const Consumer = require('../models/consumerModel')

exports.addGoal = async (req, res, next) => {
    try {
        const userId = req.user.id
        const consumer = await Consumer.findOne({ where: { userId } })
        const { protein, carbohydrates, fats, calories, start_date, end_date } = req.body
        const goal = await Goals.create({
            protein,
            calories,
            carbohydrates,
            fats,
            start_date,
            end_date,
            consumerId: consumer.id,
        })
        res.status(200).json({
            status: 'success',
            data: { goal },
        })
    } catch (error) {
        console.log(error)
        next(new AppError(error.message, 404))
    }
}

exports.getAllGoals = async (req, res, next) => {
    try {
        const userId = req.user.id
        const consumer = await Consumer.findOne({ where: { userId } })
        const goals = await Goals.findAll({ where: { consumerId: consumer.id } })
        res.status(200).json({
            status: 'success',
            data: { goals },
        })
    } catch (error) {
        console.log(error)
        next(new AppError(error.message, 404))
    }
}

exports.getOneGoal = async (req, res, next) => {
    try {
        const userId = req.user.id
        const consumer = await Consumer.findOne({ where: { userId } })
        const goal = await Goals.findOne({ where: { consumerId: consumer.id, id: req.params.id } })
        res.status(200).json({
            status: 'success',
            data: { goal },
        })
    } catch (error) {
        console.log(error)
        next(new AppError(error.message, 404))
    }
}

exports.updateGoal = async (req, res, next) => {
    try {
        const userId = req.user.id
        const consumer = await Consumer.findOne({ where: { userId } })
        const goal = await Goals.update(req.body, {
            where: { consumerId: consumer.id, id: req.params.id },
            returning: true,
            plain: true,
        })
        res.status(200).json({
            status: 'success',
            data: { goal },
        })
    } catch (error) {
        console.log(error)
        next(new AppError(error.message, 404))
    }
}
