// models
const Program = require('../models/programModel')
const Trainer = require('../models/personalTrainerModel')
const Food = require('../models/mealModel')
const Consumer = require('../models/consumerModel')
const User = require('../models/userModel')
const Meal = require('../models/programTimeModel')
// utils
const CatchError = require('../utils/catchErrorAsyncFunc')
const AppError = require('../utils/AppError')
const response = require('../utils/response')
const Swap = require('../models/swaperModel')
const Recipe = require('../models/recipeModel')
const Ingredient = require('../models/ingredientModel')
const multer = require('multer')
const ProgramConsumer = require('../models/programConsumerModel')
const s3Client = require('../configs/s3Client')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')
const { PutObjectCommand, GetObjectCommand, DeleteObjectsCommand } = require('@aws-sdk/client-s3')
const crypto = require('crypto')

function DayToNumber(day) {
    const dayLower = day.toLowerCase()
    let dayNumber = 0
    switch (dayLower) {
        case 'monday':
            dayNumber = 0
            break
        case 'tuesday':
            dayNumber = 1
            break
        case 'wednesday':
            dayNumber = 2
            break
        case 'thursday':
            dayNumber = 3
            break
        case 'friday':
            dayNumber: 4
            break
        case 'saturday':
            dayNumber = 5
            break
        case 'sunday':
            dayNumber = 6
            break
        default:
            dayNumber = 0
            break
    }
    return dayNumber
}

const memoryStroge = multer.memoryStorage()

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        return cb(null, true)
    } else {
        return cb(new AppError('You only upload images!', 400))
    }
}

exports.upload = multer({
    storage: memoryStroge,
})

exports.addProgram = CatchError(async (req, res, next) => {
    const userId = req.user.id
    let macros = {
        cals: 0,
        carbs: 0,
        protein: 0,
        fat: 0,
    }
    const filename = crypto.randomUUID()
    let total_recipes = 0

    const trainer = await Trainer.findOne({ where: { userId } })

    if (!trainer && req.user.role === 'nutritionist') throw new Error('Nutritionist is not exist')

    const { name, description, preference, weeks } = req.body
    let meals = req.body.meals
    let image_url = ''
    if (req.file) {
        await s3Client.send(
            new PutObjectCommand({
                Key: filename,
                Bucket: process.env.DO_SPACE_BUCKET,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
            })
        )

        image_url = await getSignedUrl(
            s3Client,
            new GetObjectCommand({ Key: filename, Bucket: process.env.DO_SPACE_BUCKET }),
            { expiresIn: 3600 * 24 }
        )
    }
    const program = await Program.create({
        nutritionistId: trainer?.id ? trainer?.id : null,
        name,
        description,
        preference,
        weeks,
        image: filename,
        image_url,
    })

    if (meals) {
        if (typeof meals === 'string') {
            meals = JSON.parse(meals)
        }
        for (let i = 0; i < meals.length; i++) {
            const { week, day, food_items } = meals[i]

            const numberDay = DayToNumber(day)
            const meal = await Meal.create({ week, day: numberDay, programId: program.id })
            if (food_items) {
                for (let k = 0; k < food_items.length; k++) {
                    const { serving, quantity, course, title, image_url, recipe_id, fat, cals, carbs, protein, notes } =
                        food_items[k]
                    const mealId = meal.id

                    await Food.create({
                        serving,
                        quantity,
                        course,
                        image_url,
                        mealId,
                        title,
                        recipeId: recipe_id,
                        notes,
                    })
                    total_recipes++
                    macros.cals += cals
                    macros.carbs += carbs
                    macros.protein += protein
                    macros.fat += fat
                }
            }
        }
    }

    program.cals = macros.cals
    program.carbs = macros.carbs
    program.protein = macros.protein
    program.fat = macros.fat
    program.total_recipes = total_recipes || 0
    await program.save()
    if (req.user.role === 'consumer') {
        const consumer = await Consumer.findOne({ where: { userId } })
        await ProgramConsumer.create({
            programId: program.id,
            consumerId: consumer.id,
            isAssigned: false,
            sideAssign: 'consumer',
        })
    }

    response(201, 'You are successfully added to program', true, '', res)
})

exports.getAllPrograms = CatchError(async (req, res, next) => {
    let { offset, number } = req.query
    offset = +offset || undefined
    number = +number || undefined

    const userId = req.user.id
    const trainer = await Trainer.findOne({ where: { userId } })
    if (!trainer) next(new AppError("You can't allowed this method", 404))
    const programs = await Program.findAll({ where: { nutritionistId: trainer.id }, offset, limit: number })
    response(200, 'You are successfully geting programs', true, { programs }, res)
})

exports.getProgram = CatchError(async (req, res, next) => {
    const { id } = req.params

    const userId = req.user.id
    const trainer = await Trainer.findOne({ where: { userId } })
    if (!trainer) next(new AppError("You can't allowed this method", 404))

    const program = await Program.findByPk(id, {
        include: [
            {
                model: Meal,
                include: [{ model: Food, include: [{ model: Swap }, { model: Recipe, include: Ingredient }] }],
            },
            { model: Consumer, include: [{ model: User }] },
        ],
        where: { nutritionistId: trainer.id },
    })

    if (req.user.role === 'consumer') {
        const consumer = await Consumer.findOne({ where: { userId } })
        consumer.program_id = program.id
        await consumer.save()
    }
    response(200, 'You are successfully geted one program', true, { program }, res)
})

exports.updatePrograms = CatchError(async (req, res, next) => {
    const file = req.file
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

exports.addMealToProgram = CatchError(async (req, res, next) => {
    const { id } = req.params

    const { week, day, food_items } = req.body
    const program = await Program.findByPk(id)
    if (!program) next(new AppError(`Program by id ${id} not found`, 404))
    let total_macros = {
        cals: program.cals,
        fats: program.fats,
        carbs: program.carbs,
        protein: program.protein,
    }
    const mealFood = await ProgramTime.create({ week, day, programId: program.id })
    for (let k = 0; k < food_items.length; k++) {
        const { food_id, serving, quantity, course, cals, protein, fats, carbs, title, image_url } = food_items[k]

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

    program.cals = total_macros.cals
    program.protein = total_macros.protein
    program.carbs = total_macros.carbs
    program.fats = total_macros.fats
    await program.save()
    response(201, 'You are successfully added to program', true, '', res)
})

exports.searchPrograms = CatchError(async (req, res, next) => {
    const { search } = req.query
    const userId = req.user.id
    const trainer = await Trainer.findOne({ where: { userId } })
    const program = await Program.findOne({ where: { name: search, nutritionistId: trainer.id } })
    response(200, 'Your search program', true, program, res)
})

exports.getMeals = CatchError(async (req, res, next) => {
    const userId = req.user.id
    const consumerId = req.params.consumerId
    const trainer = await Trainer.findOne({ where: { userId } })
    const consumer = await Consumer.findByPk(consumerId, {
        include: [
            {
                model: Program,
                where: { nutritionistId: trainer.id },
                include: [
                    {
                        model: Meal,
                        include: [{ model: Food, include: [{ model: Recipe, include: [{ model: Ingredient }] }] }],
                    },
                ],
            },
        ],
    })
    if (!consumer) {
        next(new AppError('You are not assign consumer to program', 400))
    }

    response(200, 'You are get all meals', true, { programs: consumer?.programs }, res)
})

exports.createSelfPorgam = CatchError(async (req, res, next) => {
    const userId = req.user.id
    const consumer = await Consumer.findOne({ where: { userId } })
    const program = await Program.findByPk(consumer?.program_id, { include: [{ model: Meal }] })
    const { name, description, preference, weeks, meals } = req.body
    if (program.meals) {
        for (let i = 0; i < program.meals.length; i++) {
            await Meal.destroy({ where: { id: program.meals[i]?.id } })
        }
    }
    let macros = {
        cals: 0,
        carbs: 0,
        protein: 0,
        fat: 0,
    }
    let total_recipes = 0
    if (meals) {
        for (let i = 0; i < meals.length; i++) {
            const { week, day, food_items } = meals[i]

            const numberDay = DayToNumber(day)
            const meal = await Meal.create({ week, day: numberDay, programId: program.id })
            if (food_items) {
                for (let k = 0; k < food_items.length; k++) {
                    const {
                        serving,
                        quantity,
                        course,
                        title,
                        image_url,
                        recipe_id,
                        fat,
                        cals,
                        carbs,
                        protein,
                        notes,
                        recipe,
                    } = food_items[k]
                    const mealId = meal.id

                    const newRecipe = await Recipe.create({ ...recipe })
                    for (let i = 0; i < recipe.ingredients.length; i++) {
                        const { spoon_id, name, amount, unit, protein, fat, cals, carbs, image } = recipe.ingredients[i]

                        await Ingredient.create({
                            spoon_id,
                            name,
                            amount,
                            unit,
                            cals,
                            carbs,
                            protein,
                            fat,
                            recipeId: newRecipe.id,
                            image,
                        })
                    }

                    await Food.create({
                        serving,
                        quantity,
                        course,
                        image_url,
                        mealId,
                        title,
                        recipeId: newRecipe.id,
                        notes,
                    })
                    total_recipes++
                    macros.cals += cals
                    macros.carbs += carbs
                    macros.protein += protein
                    macros.fat += fat
                }
            }
        }
    }
    program.name = name || program.name
    program.weeks = weeks || program.weeks
    program.preference = preference
    program.cals = macros.cals
    program.carbs = macros.carbs
    program.protein = macros.protein
    program.fat = macros.fat
    program.total_recipes = total_recipes || 0
    await program.save()
    response(201, 'You are successfully added to program', true, '', res)
})

exports.getAllProgramsConsumer = CatchError(async (req, res, next) => {
    const userId = req.user.id
    const consumer = await Consumer.findOne({
        where: { userId },
        include: [
            {
                model: Program,

                include: [
                    { model: Meal, include: [{ model: Food, include: [{ model: Recipe, include: Ingredient }] }] },
                ],
            },
        ],
    })
    response(200, 'You are successfully get programs', true, { programs: consumer?.programs }, res)
})
