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
        protein: 0,
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
                const { food_id, serving, quantity, course, cals, protein, fats, carbs, title, image_url } =
                    food_items[k]
                await Meal.create({
                    food_id,
                    serving,
                    quantity,
                    course,
                    image_url,
                    mealplanFoodId: mealFood.id,
                    protein,
                    title,
                    cals,
                    carbs,
                    fats,
                })
                total_macros.protein += protein
                total_macros.cals += cals
                total_macros.fats += fats
                total_macros.carbs += carbs
            }
        }
    }

    program.cals = total_macros.cals
    program.protein = total_macros.protein
    program.carbs = total_macros.carbs
    program.fats = total_macros.fats
    await program.save()
    response(201, 'You are successfully added to program', true, '', res)
})

exports.getAllPrograms = CatchError(async (req, res, next) => {
    const userId = req.user.id
    const trainer = await Trainer.findOne({ where: { userId } })
    if (!trainer) next(new AppError("You can't allowed this method", 404))
    const programs = await Program.findAll({ where: { nutritionistId: trainer.id } })
    response(200, 'You are successfully geting programs', true, { programs }, res)
})

exports.getProgram = CatchError(async (req, res, next) => {
    const { id } = req.params
    const userId = req.user.id
    const trainer = await Trainer.findOne({ where: { userId } })
    if (!trainer) next(new AppError("You can't allowed this method", 404))

    const program = await Program.findByPk(id, {
        include: [{ model: ProgramTime, include: [{ model: Meal }] }],
        where: { nutritionistId: trainer.id },
    })

    response(200, 'You are successfully geted one program', true, { program }, res)
})

exports.updatePrograms = CatchError(async (req, res, next) => {
    const { name, description, weeks, preference } = req.body
    const userId = req.user.id
    const trainer = await Trainer.findOne({ where: { userId } })
    if (!trainer) next(new AppError("You don't access this request"))
    const program = await Program.findByPk(req.params.id, { where: { nutritionistId: trainer.id } })

    if (!program) next(new AppError('Program not found', 404))

    program.name = name || program.name
    program.description = description || program.description
    program.weeks = weeks || program.weeks
    program.preference = preference || program.preference

    await program.save()
    response(
        203,
        'You are successfuly update program',
        true,
        { program: { name: program.name, description: program.description } },
        res
    )
})

exports.deletePrograms = CatchError(async (req, res, next) => {
    const { id } = req.params
    await Program.destroy({ where: { id } })
    response(204, 'You deleted program', true, '', res)
})

/*
 * POST # add programs  # /programs
 * GET # get all programs # /programs
 * GET # get one program # /progams/:id
 * PATCH # update programs # /programs/:id
 * POST # add additioanal recipe # /programs/:id
 * DELETE # deleted programs # /programs
 * PATCH # edit meals # /program/:id/foods/:food_id
 */
