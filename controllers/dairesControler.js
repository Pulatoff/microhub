const { Op } = require('sequelize')
const axios = require('axios')
const { SPOONACULAR_API_KEY, SPOONACULAR_API_URL } = require('../configs/URL')
// models
const Consumer = require('../models/consumerModel')
const Dairy = require('../models/dairyModel')
const FoodConsumer = require('../models/foodConsumerModel')
const moment = require('moment')
// utils
const AppError = require('../utils/AppError')
const CatchError = require('../utils/catchErrorAsyncFunc')
const response = require('../utils/response')
const Food = require('../models/mealModel')
const Recipe = require('../models/recipeModel')
const Ingredient = require('../models/ingredientModel')

exports.addDairy = CatchError(async (req, res, next) => {
    const { foodItemId, course, foods, date } = req.body
    const userId = req.user.id
    let diary
    const startDate = moment(date).format('YYYY-MM-DD 00:00')
    const endDate = moment(date).format('YYYY-MM-DD 23:59')

    let macros = {
        cals: 0,
        carbs: 0,
        protein: 0,
        fat: 0,
    }

    const consumer = await Consumer.findOne({ where: { userId } })

    diary = await Dairy.findOne({
        where: { course, createdAt: { [Op.between]: [startDate, endDate] }, consumerId: consumer.id },
    })

    if (!diary) {
        diary = await Dairy.create({ course, foodItemId, consumerId: consumer.id })
    }

    const macrosFoodItems = await getFoodItem(foodItemId)
    const macroFoods = await addFood(foods, diary.id)

    diary.fat = macros.fat + macrosFoodItems.fat + macroFoods.fat
    diary.cals = macros.cals + macrosFoodItems.cals + macroFoods.cals
    diary.carbs = macros.carbs + macrosFoodItems.carbs + macroFoods.carbs
    diary.protein = macros.protein + macrosFoodItems.protein + macroFoods.protein
    await diary.save()
    response(201, 'you successfully add your diary', true, {}, res)
})

exports.getDairy = CatchError(async (req, res, next) => {
    const userId = req.user.id
    const consumer = await Consumer.findOne({ where: { userId } })

    const diaries = await Dairy.findAll({
        where: { consumerId: consumer.id },
        include: [{ model: FoodConsumer }, { model: Food, include: [{ model: Recipe, include: Ingredient }] }],
    })

    response(200, 'You are successfuly getting your diaries', true, { diaries }, res)
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
    const { course, foodItemId } = req.body
    const consumer = await Consumer.findOne({ where: { userId } })
    const diary = await Dairy.findOne({
        where: { id: req.params.id, consumerId: consumer.id },
    })
    if (!diary) next(new AppError('this diary not found,please try again', 400))
    diary.course = course || diary.course
    diary.foodItemId = foodItemId || diary.foodItemId
    await diary.save()
    response(203, 'You are successfully update your diary', true, { diary }, res)
})

exports.updateDairyFood = CatchError(async (req, res, next) => {
    const id = req.params.id
    const { amount, unit } = req.body
    const food = await FoodConsumer.findByPk(id)
    const foodMacros = await ingredintGetMacros(food.spoon_id, amount || food.amount, unit || 'g')

    food.cals = foodMacros.cals
    food.carbs = foodMacros.carbs
    food.fat = foodMacros.fat
    food.protein = foodMacros.protein
    food.amount = amount || food.amount
    food.unit = unit || food.unit
    await food.save()

    response(203, 'You are successfully updated food', true, '', res)
})

exports.getDairyDaily = CatchError(async (req, res, next) => {
    const date = req.body.date
    const userId = req.user.id
    const startDate = moment(date).format('YYYY-MM-DD 00:00')
    const endDate = moment(date).format('YYYY-MM-DD 23:59')

    const consumer = await Consumer.findOne({ where: { userId } })

    const diaries = await Dairy.findAll({
        where: { consumerId: consumer.id, createdAt: { [Op.between]: [startDate, endDate] } },
        include: [{ model: FoodConsumer }, { model: Food, include: [{ model: Recipe, include: Ingredient }] }],
    })
    const diariesRes = []
    diaries.map((diary) => {
        diariesRes.push({
            id: diary.id,
            cals: diary.cals,
            carbs: diary.carbs,
            protein: diary.protein,
            fat: diary.fat,
            course: diary.course,
            foodItem: diary.food_item,
            foods: diary.food_clients,
            createdAt: diary.createdAt,
        })
    })

    response(200, 'You are successfully get diary', true, { diaries: diariesRes }, res)
})

exports.deleteDairy = CatchError(async (req, res, next) => {
    const id = req.params.id

    await Dairy.destroy({ where: { id } })

    response(200, 'You are successfully delete diary', true, {}, res)
})

exports.deleteDairyFood = CatchError(async (req, res, next) => {
    const id = req.params.id
    await FoodConsumer.destroy({ where: { id } })
    response(206, 'You are successfully delete food in diary', true, '', res)
})

async function ingredintGetMacros(id, amount, unit) {
    const macro = { cals: 0, carbs: 0, protein: 0, fat: 0 }
    const ingredient = await axios.get(
        `${SPOONACULAR_API_URL}/food/ingredients/${id}/information?apiKey=${SPOONACULAR_API_KEY}&amount=${amount}&unit=${unit}`
    )
    ingredient.data.nutrition.nutrients.map((val) => {
        if (val.name.toLowerCase() === 'calories') {
            macro.cals = val.amount
        } else if (val.name.toLowerCase() === 'carbohydrates') {
            macro.carbs = val.amount
        } else if (val.name.toLowerCase() === 'fat') {
            macro.fat = val.amount
        } else if (val.name.toLowerCase() === 'protein') {
            macro.protein = val.amount
        }
    })
    return macro
}

async function addFood(foods, diaryId) {
    const macros = { cals: 0, carbs: 0, fat: 0, protein: 0 }
    if (foods) {
        for (let i = 0; i < foods.length; i++) {
            const food = foods[i]
            const foodClient = await FoodConsumer.findOne({ where: { diaryId, spoon_id: food.spoon_id } })
            if (!foodClient) {
                await FoodConsumer.create({
                    name: food.name,
                    cals: food.cals,
                    carbs: food.carbs,
                    protein: food.protein,
                    fat: food.fat,
                    amount: food.amount,
                    unit: food.unit,
                    diaryId,
                    image: food.image,
                    spoon_id: food.spoon_id,
                })
            }

            const macro = await ingredintGetMacros(food.spoon_id, food.amount)

            macros.fat += macro.fat
            macros.cals += macro.cals
            macros.carbs += macro.carbs
            macros.protein += macro.protein
        }
    }
    return macros
}

async function getFoodItem(foodItemId) {
    const macros = { cals: 0, carbs: 0, fat: 0, protein: 0 }
    const foodItem = await Food.findByPk(foodItemId, { include: [{ model: Recipe }] })
    macros.cals = foodItem.recipe.cals
    macros.carbs = foodItem.recipe.carbs
    macros.fat = foodItem.recipe.fat
    macros.protein = foodItem.recipe.protein
    return macros
}
