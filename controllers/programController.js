// models
const Program = require('../models/programModel')
const Trainer = require('../models/personalTrainerModel')
const Meal = require('../models/mealModel')
const Consumer = require('../models/consumerModel')
const ProgramTime = require('../models/programTimeModel')
// utils
const CatchError = require('../utils/catchErrorAsyncFunc')
const AppError = require('../utils/AppError')
const response = require('../utils/response')

exports.addProgram = CatchError(async (req, res, next) => {
    let total_macros = {
        cals: 0,
        fats: 0,
        carbs: 0,
        protein: 1,
    }
    const userId = req.user.id
    const trainer = await Trainer.findOne({ where: { userId } })
    const { name, description, preference, weeks, meals } = req.body

    const program = await Program.create({ nutritionistId: trainer.id, name, description, preference, weeks })
    if (meals) {
        for (let i = 0; i < meals.length; i++) {
            const { week, day, food_items } = meals[i]
            const mealFood = await ProgramTime.create({ week, day, programId: program.id })
            for (let k = 0; k < food_items.length; k++) {
                const { food_id, serving, quantity, course, cals, protein, fats, carbs } = food_items[k]
                await Meal.create({ food_id, serving, serving, quantity, course, mealplanFoodId: mealFood.id })
                total_macros.protein += protein
                total_macros.cals += cals
                total_macros.fats += fats
                total_macros.carbs += carbs
            }
        }
    }

    console.log(total_macros)
    response(201, 'You are successfully added to program', true, '', res)
})

exports.getAllPrograms = CatchError(async (req, res, next) => {
    const userId = req.user.id

    const consumer = await Consumer.findOne({
        where: { userId },
        include: [
            {
                model: Program,
                attributes: ['name', 'id', 'description', 'createdAt'],
                include: [{ model: Meal, attributes: ['food_id', 'serving', 'quantity', 'course'] }],
            },
        ],
    })
    response(200, 'You are successfully geting programs', true, { programs: consumer.programs }, res)
})

exports.getProgram = CatchError(async (req, res, next) => {
    const { id } = req.params
    const program = await Program.findByPk(id, {
        include: [{ model: Meal, as: 'meals' }],
    })
    response(200, 'You are successfully geted one program', true, { program }, res)
})

exports.updatePrograms = CatchError(async (req, res, next) => {
    const { name, description } = req.body
    const userId = req.user.id
    const trainer = await Trainer.findOne({ where: { userId } })
    if (!trainer) next(new AppError("Tou don't access this query"))
    const program = await Program.findByPk(req.params.id, { where: { nutritionistId: trainer.id } })

    if (!program) next(new AppError('Program not found', 404))

    program.name = name || program.name
    program.description = description || program.description
    await program.save()
    response(
        203,
        'You are successfuly update program',
        true,
        { program: { name: program.name, description: program.description } },
        res
    )
})

// example program data body
// const obj = {
//     name: 'Program1',
//     description: 'a lot of text',
//     meals: [
//         {
//             week: 1,
//             day: 'Monday',
//             food_items: [
//                 {
//                     food_id: 1,
//                     quantity: 2,
//                     serving: '150g',
//                 },
//             ],
//         },
//         {
//             week: 1,
//             day: 'Monday',
//             food_items: [
//                 {
//                     food_id: 1,
//                     quantity: 2,
//                     serving: '150g',
//                 },
//             ],
//         },
//     ],
// }
