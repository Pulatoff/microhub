// models
const Goals = require('../models/goalModel')
const Consumer = require('../models/consumerModel')
// utils
const CatchError = require('../utils/catchErrorAsyncFunc')
const response = require('../utils/response')

exports.addGoal = CatchError(async (req, res, next) => {
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
    response(
        201,
        'You are successfully added your program',
        true,
        {
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
        res
    )
})

exports.getAllGoals = CatchError(async (req, res, next) => {
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
    response(200, 'You are  successfully get all plans', true, { goals }, res)
})

exports.getOneGoal = CatchError(async (req, res, next) => {
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
    response(200, 'You are successfuly added to goal', true, { goal }, res)
})

exports.updateGoal = CatchError(async (req, res, next) => {
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
    response(200, 'You are succesfully update your goal ', true, { goal }, res)
})
