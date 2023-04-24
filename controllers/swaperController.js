const Swaper = require('../models/swaperModel')
const CatchError = require('../utils/catchErrorAsyncFunc')
const response = require('../utils/response')
const { SPOONACULAR_API_KEY, SPOONACULAR_API_URL } = require('../configs/URL')
const Consumer = require('../models/consumerModel')
const Ingredient = require('../models/ingredientModel')
const axios = require('axios')
const AppError = require('../utils/AppError')
const formatMacros = require('../utils/formatMacros')
const querystring = require('querystring')

exports.addSwapIngredient = CatchError(async (req, res, next) => {
    const { ingredientId, swapIngredientId, foodItemId } = req.body
    const userId = req.user.id
    const consumer = await Consumer.findOne({ userId })
    const spoonData = await axios.get(
        `${SPOONACULAR_API_URL}/food/ingredients/${swapIngredientId}/information?apiKey=${SPOONACULAR_API_KEY}&unit=g&amount=1`
    )

    const data = spoonData.data
    const macros = formatMacros(data.nutrition.nutrients)

    const swap = await Swaper.create({
        ingredientId,
        swapIngredientId,
        foodItemId,
        consumerId: consumer.id,
        ingredientInfo: JSON.stringify({
            id: data.id,
            name: data.name,
            amount: data.amount,
            unit: data.unit,
            possibleUnits: data.possibleUnits,
            image: data.image,
            ...macros,
        }),
    })
    response(201, 'You are successfully swap ingredient', true, { swap }, res)
})

exports.searchSwapIngredints = CatchError(async (req, res, next) => {
    let { ingredient_id, gap, swap_ingredient, offset, number } = req.query
    offset = offset || 0
    number = number || 1
    const swaps = []
    const ingredient = await Ingredient.findByPk(ingredient_id)

    const spoon = await axios.get(
        `${SPOONACULAR_API_URL}/food/ingredients/${ingredient?.spoon_id}/information?amount=${ingredient?.amount}&apiKey=${SPOONACULAR_API_KEY}&unit=${ingredient?.unit}`
    )

    if (!spoon.data) next(new AppError('Not found ingredient whatt you search', 404))
    const macros = getMacros(spoon.data.nutrition.nutrients)

    const swap = await axios.get(
        `${SPOONACULAR_API_URL}/food/ingredients/search?query=${swap_ingredient}&apiKey=${SPOONACULAR_API_KEY}&minProteinPercent${
            macros.protein - gap * macros.protein
        }&maxProteinPercent=${macros.protein + gap * macros.protein}&minFatPercent=${
            macros.fat - gap * macros.fat
        }&maxFatPercent=${macros.fat + gap * macros.fat}&minCarbsPercent=${
            macros.carbs - gap * macros.carbs
        }&maxCarbsPercent=${macros.carbs + gap * macros.carbs}&number=4`
    )

    if (swap?.data?.results?.length > 0) {
        for (let i = 0; i < swap.data.results.length; i++) {
            const responData = await axios.get(
                `${SPOONACULAR_API_URL}/food/ingredients/${swap.data.results[i].id}/information?apiKey=${SPOONACULAR_API_KEY}&unit=${ingredient?.unit}&amount=${ingredient?.amount}`
            )
            const data = responData.data
            const macro = formatMacros(data.nutrition.nutrients)

            const structuredIngredient = {
                id: data.id,
                name: data.name,
                amount: data.amount,
                unit: data.unit,
                possibleUnits: data.possibleUnits,
                image: data.image,
                ...macro,
            }

            swaps.push(structuredIngredient)
        }
    }

    if (swaps.length === 0) {
        const resp = await axios.get(
            `${SPOONACULAR_API_URL}/food/ingredients/substitutes?ingredientName=${ingredient.name}&apiKey=${SPOONACULAR_API_KEY}`
        )
        const substitutes = resp.data?.substitutes
        if (substitutes) {
            for (let i = 0; i < substitutes.length; i++) {
                const subsitute = substitutes[i]
                const subIngredientName = subsitute.split(' ')
                const ingredientResponse = await axios.get(
                    `${SPOONACULAR_API_URL}/food/ingredients/search?query=${subIngredientName[5]}&apiKey=${SPOONACULAR_API_KEY}`
                )

                const respona = await axios.get(
                    `${SPOONACULAR_API_URL}/food/ingredients/${ingredientResponse.data.results[0].id}/information?apiKey=${SPOONACULAR_API_KEY}&unit=${ingredient?.unit}&amount=${ingredient?.amount}`
                )
                swaps.push(respona.data)
            }
        }
    }

    response(200, `Found ${swaps.length} substitutes for the ingredient`, true, { data: swaps }, res)
})

exports.searchIngredientToSwap = CatchError(async (req, res, next) => {
    const { search } = req.query

    const swapData = await axios.get(
        `${SPOONACULAR_API_URL}/food/ingredients/substitutes?ingredientName=${search}&apiKey=${SPOONACULAR_API_KEY}`
    )

    const parseResponse = await axios.post(
        `${SPOONACULAR_API_URL}/recipes/parseIngredients?apiKey=${SPOONACULAR_API_KEY}`,
        querystring.stringify({ ingredientList: swapData.data.substitutes[0], servings: 1, includeNutrition: true })
    )
    response(200, 'You are successfully get swap ingredients', true, { data: parseResponse.data }, res)
})

function getMacros(nutrients) {
    let macros = { cals: 0, carbs: 0, protein: 0, fat: 0 }

    for (let i = 0; i < nutrients.length; i++) {
        const nutrient = nutrients[i]
        switch (nutrient.name.toLowerCase()) {
            case 'calories':
                macros.cals = nutrient.percentOfDailyNeeds
                break
            case 'fat':
                macros.fat = nutrient.percentOfDailyNeeds
                break
            case 'protein':
                macros.protein = nutrient.percentOfDailyNeeds
                break
            case 'carbohydrates':
                macros.carbs = nutrient.percentOfDailyNeeds
                break
            default:
                break
        }
    }
    return macros
}
