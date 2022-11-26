// models
const Course = require('../models/courseModel')
// utils
const AppError = require('../utils/AppError')
const response = require('../utils/response')
const CatchError = require('../utils/catchErrorAsyncFunc')
const Meals = require('../models/mealModel')

exports.addCourse = CatchError(async (req, res, next) => {
    const { course, diaryId, items } = req.body
    const newCourse = await Course.create({ course, diaryId })
    for (let i = 0; i <= items.length; i++) {
        const { food_id, serving, title } = items[i]
        await Meals.create({})
    }

    response(201, 'You added', true, '', res)
})
