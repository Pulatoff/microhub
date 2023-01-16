const Swaper = require('../models/swaperModel')
const CatchError = require('../utils/catchErrorAsyncFunc')
const response = require('../utils/response')
const { SPOONACULAR_API_KEY, SPOONACULAR_API_URL } = require('../configs/URL')
const Consumer = require('../models/consumerModel')
const axios = require('axios')

exports.addSwapIngredient = CatchError(async (req, res, next) => {
    const { ingredientId, swapIngredientId, foodItemId } = req.body
    const userId = req.user.id
    const consumer = await Consumer.findOne({ userId })
    await Swaper.create({ ingredientId, swapIngredientId, foodItemId, consumerId: consumer.id })
    response(201, 'You are successfully swap ingredient', true, '', res)
})

exports.searchSwapIngredints = CatchError(async (req, res, next) => {
    const { search } = req.query
    const ingredients = await axios.get(
        `${SPOONACULAR_API_URL}/food/ingredients/search?metaInformation=true&offset=${0}&number=${1}&query=${search}&apiKey=${SPOONACULAR_API_KEY}`
    )

    const ingredient = await axios(
        `${SPOONACULAR_API_URL}/food/ingredients/${ingredients.data.results[0].id}/information?amount=1&unit=${ingredients.data.results[0].possibleUnits[0]}&apiKey=${SPOONACULAR_API_KEY}`
    )
    const spoon_nutrients = ingredient.data.nutrition.nutrients
    const nutrients = {
        cals: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
    }
    spoon_nutrients.map((val) => {
        if (val.name.toLowerCase() === 'calories') {
            nutrients.cals = val.amount
        } else if (val.name.toLowerCase() === 'protein') {
            nutrients.protein = val.amount
        } else if (val.name.toLowerCase() === 'carbohydrates') {
            nutrients.carbs = val.amount
        } else if (val.name.toLowerCase() === 'fat') {
            nutrients.fat = val.amount
        }
    })

    const swap_ingredients = await axios.get(
        `${SPOONACULAR_API_URL}/recipes/findByNutrients?&minCalories=${
            nutrients.cals - 0.9 * nutrients.cals
        }&maxCalories=${nutrients.cals + 0.9 * nutrients.cals}&apiKey=${SPOONACULAR_API_KEY}`
    )

    response(200, 'You are successfully get ingredient', true, { ingredient: swap_ingredients.data }, res)
})
