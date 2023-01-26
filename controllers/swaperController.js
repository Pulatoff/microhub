const Swaper = require('../models/swaperModel')
const CatchError = require('../utils/catchErrorAsyncFunc')
const response = require('../utils/response')
const { SPOONACULAR_API_KEY, SPOONACULAR_API_URL } = require('../configs/URL')
const Consumer = require('../models/consumerModel')
const Ingredient = require('../models/ingredientModel')
const axios = require('axios')
const AppError = require('../utils/AppError')

exports.addSwapIngredient = CatchError(async (req, res, next) => {
    const { ingredientId, swapIngredientId, foodItemId } = req.body
    const userId = req.user.id
    const consumer = await Consumer.findOne({ userId })
    await Swaper.create({ ingredientId, swapIngredientId, foodItemId, consumerId: consumer.id })
    response(201, 'You are successfully swap ingredient', true, '', res)
})

exports.searchSwapIngredints = CatchError(async (req, res, next) => {
    let { ingredient_id, gap, swap_ingredient, offset, number } = req.body
    offset = offset || 0
    number = number || 1
    const ingredient = await Ingredient.findByPk(ingredient_id)
    const spoon = await axios.get(
        `${SPOONACULAR_API_URL}/food/ingredients/${ingredient.spoon_id}/information?amount=${ingredient.amount}`
    )

    if (!spoon.data) next(new AppError('Not found ingredient whatt you search', 404))
    // const macros = getMacros(spoon)
    response(200, 'You are successfully get ingredient', true, { spoon }, res)
})

function getMacros(nutrients) {
    let macros = {
        cals: 0,
        carbs: 0,
        protein: 0,
        fat: 0,
    }
    for (let i = 0; i < nutrients.length; i++) {
        const nutrient = nutrients[0]
        switch (nutrient.name.toLowerCase()) {
            case 'calories':
                macros.cals = nutrient.amount
                break
            case 'fat':
                macros.fat = nutrient.amount
                break
            case 'protein':
                macros.protein = nutrient.amount
                break
            case 'carbohydrates':
                macros.carbs = nutrient.amount
                break
            default:
                break
        }
    }
    return macros
}
