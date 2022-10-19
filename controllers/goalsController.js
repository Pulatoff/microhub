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
            data: {
                goal: {
                    id: goal.id,
                    protein: goal.protein,
                    calories: goal.calories,
                    carbohydrates: goal.carbohydrates,
                    fats: goal.fats,
                    start_date: goal.start_date,
                    end_date: goal.end_date,
                    createdAt: goal.createdAt,
                },
            },
        })
    } catch (error) {
        next(new AppError(error.message, 404))
    }
}

exports.getAllGoals = async (req, res, next) => {
    try {
        const userId = req.user.id
        const consumer = await Consumer.findOne({ where: { userId } })
        const goals = await Goals.findAll({
            where: { consumerId: consumer.id },
            attributes: [
                'id',
                'protein',
                'calories',
                'carbohydrates',
                'protein',
                'fats',
                'start_date',
                'end_date',
                'createdAt',
            ],
        })
        res.status(200).json({
            status: 'success',
            data: { goals },
        })
    } catch (error) {
        next(new AppError(error.message, 404))
    }
}

exports.getOneGoal = async (req, res, next) => {
    try {
        const userId = req.user.id
        const consumer = await Consumer.findOne({ where: { userId } })
        const goal = await Goals.findOne({
            where: { consumerId: consumer.id, id: req.params.id },
            attributes: [
                'id',
                'protein',
                'calories',
                'carbohydrates',
                'protein',
                'fats',
                'start_date',
                'end_date',
                'createdAt',
            ],
        })
        res.status(200).json({
            status: 'success',
            data: { goal },
        })
    } catch (error) {
        next(new AppError(error.message, 404))
    }
}

exports.updateGoal = async (req, res, next) => {
    try {
        const userId = req.user.id
        const { protein, fats, calories, carbohydrates, start_date, end_date } = req.body
        const consumer = await Consumer.findOne({ where: { userId } })
        const goal = await Goals.findOne({ where: { consumerId: consumer.id, id: req.params.id } })
        goal.protein = protein || goal.protein
        goal.fats = fats || goal.fats
        goal.calories = calories || goal.calories
        goal.carbohydrates = carbohydrates || goal.carbohydrates
        goal.start_date = start_date || goal.start_date
        goal.end_date = end_date || goal.end_date
        await goal.save()
        res.status(200).json({
            status: 'success',
            data: { goal },
        })
    } catch (error) {
        next(new AppError(error.message, 404))
    }
}
