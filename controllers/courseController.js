// models
const Course = require('../models/programTimeModel')
const Meal = require('../models/mealModel')
// utils
const AppError = require('../utils/AppError')
const response = require('../utils/response')
const CatchError = require('../utils/catchErrorAsyncFunc')

exports.addCourse = CatchError(async (req, res, next) => {
    const { programId } = req.body
    const { day, week, food_items } = req.body
    if (!day || !week || !food_items) next(new AppError('You need enter all fields', 404))
    const mealplanFood = await Course.create({ day, week, programId })
    for (let i = 0; i <= food_items.length; i++) {
        const { food_id, quantity, serving, course } = food_items[i]
        await Meal.create({ food_id, quantity, serving, course, mealplanFoodId: mealplanFood.id })
    }
    response(200, 'You are success added recipe plan', true, '', res)
})
