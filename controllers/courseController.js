// models
const Course = require('../models/courseModel')
// utils
const AppError = require('../utils/AppError')
const response = require('../utils/response')
const CatchError = require('../utils/catchErrorAsyncFunc')
const Meals = require('../models/mealModel')

exports.addCourse = CatchError(async (req, res, next) => {
    const { day, week, course, meals } = req.body
    const newCourse = await Course.create({ day, week })
    for (let i = 0; i <= meals.length; i++) {
        const { food_id, serving, title, cals } = meals[i]
        await Meals.create({ food_id, serving, quantity, course, title, cals })
    }

    response(201, 'You added', true, '', res)
})

// const obj = [
//     {
//         day: 'Monday',
//         course: 'breakfast',
//         week: 1,
//         food_items: [{}],
//     },
// ]
