// models
const Consumer = require('../models/consumerModel')
const Dairy = require('../models/dairyModel')
const Program = require('../models/programModel')
const Swaper = require('../models/swaperModel')
const ConsumerProgram = require('../models/programConsumerModel')
const FoodConsumer = require('../models/foodConsumerModel')
// utils
const AppError = require('../utils/AppError')
const CatchError = require('../utils/catchErrorAsyncFunc')

const response = require('../utils/response')
const Food = require('../models/mealModel')
const Recipe = require('../models/recipeModel')
const Ingredient = require('../models/ingredientModel')

exports.addDairy = CatchError(async (req, res, next) => {
    const { foodItemId, course, foods } = req.body
    const userId = req.user.id

    const consumer = await Consumer.findOne({ where: { userId } })

    const diary = await Dairy.create({ course, foodItemId, consumerId: consumer.id })

    for (let i = 0; i < foods.length; i++) {
        const food = foods[i]
        await FoodConsumer.create({
            title: food.title,
            cals: food.cals,
            carbs: food.carbs,
            protein: food.protein,
            fat: food.fat,
            amount: food.amount,
            unit: food.unit,
            diaryId: diary.id,
        })
    }

    response(201, 'you successfully add your diary', true, {}, res)
})

exports.getDairy = CatchError(async (req, res, next) => {
    const userId = req.user.id
    const consumer = await Consumer.findOne({ where: { userId } })

    const dairy = await Dairy.findAll({
        where: { consumerId: consumer.id },
        include: [{ model: FoodConsumer }, { model: Food, include: [{ model: Recipe, include: Ingredient }] }],
    })

    response(200, 'You are successfuly getting your diaries', true, { dairy }, res)
})

exports.getOneDairy = CatchError(async (req, res, next) => {
    const userId = req.user.id
    const consumer = await Consumer.findOne({ where: { userId } })

    const diary = await Dairy.findByPk(req.params.id, {
        where: { consumerId: consumer.id },
        attributes: ['id', 'serving', 'course', 'quantity', 'course', 'date', 'createdAt'],
        include: [{ model: Program, attributes: ['id', 'name', 'description', 'createdAt'] }, { model: Swaper }],
    })

    if (!diary) next("This diary don't belongs to you")
    response(200, 'You are successfully geting one diary', true, { diary }, res)
})

exports.updateDairy = CatchError(async (req, res, next) => {
    const userId = req.user.id
    const { date, course, food_id, quantity, serving } = req.body
    const consumer = await Consumer.findOne({ where: { userId } })
    const diary = await Dairy.findOne({
        where: { id: req.params.id, consumerId: consumer.id },
        attributes: ['id', 'date', 'course', 'food_id', 'quantity', 'serving'],
    })
    if (!diary) next(new AppError('this diary not found,please try again'))
    diary.date = date || diary.date
    diary.course = course || diary.course
    diary.food_id = food_id || diary.food_id
    diary.quantity = quantity || diary.quantity
    diary.serving = serving || diary.serving
    await diary.save()
    response(203, 'You are successfully update your diary', true, { diary }, res)
})
