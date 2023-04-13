// models
const Consumer = require('../models/consumerModel')
const Dairy = require('../models/dairyModel')
const Program = require('../models/programModel')
const Swaper = require('../models/swaperModel')
const ConsumerProgram = require('../models/programConsumerModel')
const FoodConsumer = require('../models/foodConsumerModel')
const moment = require('moment')
// utils
const AppError = require('../utils/AppError')
const CatchError = require('../utils/catchErrorAsyncFunc')
const response = require('../utils/response')
const Food = require('../models/mealModel')
const Recipe = require('../models/recipeModel')
const Ingredient = require('../models/ingredientModel')
const { Op } = require('sequelize')

exports.addDairy = CatchError(async (req, res, next) => {
    const { foodItemId, course, foods } = req.body
    const userId = req.user.id
    let macros = {
        cals: 0,
        carbs: 0,
        protein: 0,
        fat: 0,
    }

    const consumer = await Consumer.findOne({ where: { userId } })
    const foodItem = await Food.findByPk(foodItemId, { include: Recipe })

    macros.cals += foodItem.recipe.cals
    macros.fat += foodItem.recipe.fat
    macros.carbs += foodItem.recipe.carbs
    macros.protein += foodItem.recipe.protein

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

        macros.fat += food.fat
        macros.cals += food.cals
        macros.carbs += food.carbs
        macros.protein += food.protein
    }
    diary.fat = macros.fat
    diary.cals = macros.cals
    diary.carbs = macros.carbs
    diary.protein = macros.protein
    await diary.save()
    response(201, 'you successfully add your diary', true, {}, res)
})

exports.getDairy = CatchError(async (req, res, next) => {
    const userId = req.user.id
    const consumer = await Consumer.findOne({ where: { userId } })

    const dairy = await Dairy.findAll({
        where: { consumerId: consumer.id },
        include: [{ model: FoodConsumer }, { model: Food, include: [{ model: Recipe, include: Ingredient }] }],
    })

    response(200, 'You are successfuly getting your diaries', true, { diary }, res)
})

exports.getOneDairy = CatchError(async (req, res, next) => {
    const userId = req.user.id
    const consumer = await Consumer.findOne({ where: { userId } })

    const diary = await Dairy.findByPk(req.params.id, {
        where: { consumerId: consumer.id },
        include: [{ model: FoodConsumer }, { model: Food, include: [{ model: Recipe, include: Ingredient }] }],
    })

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
    if (!diary) next(new AppError('this diary not found,please try again', 400))
    diary.date = date || diary.date
    diary.course = course || diary.course
    await diary.save()
    response(203, 'You are successfully update your diary', true, { diary }, res)
})

exports.getDairyDaily = CatchError(async (req, res, next) => {
    const date = req.body.date
    const userId = req.user.id
    const startDate = moment(date).format('YYYY-MM-DD 00:00')
    const endDate = moment(date).format('YYYY-MM-DD 23:59')

    const consumer = await Consumer.findOne({ where: { userId } })

    const diary = await Dairy.findAll({
        where: { consumerId: consumer.id, createdAt: { [Op.between]: [startDate, endDate] } },
    })
    response(200, 'You are successfully get diary', true, { diary }, res)
})
