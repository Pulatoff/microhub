const axios = require('axios')
// configs
const { SPOONACULAR_API_URL, SPOONACULAR_API_KEY } = require('../configs/URL')
// utils
const CatchError = require('../utils/catchErrorAsyncFunc')
const response = require('../utils/response')
const AppError = require('../utils/AppError')
// models
const Trainer = require('../models/personalTrainerModel')
const Recipes = require('../models/recipeModel')

exports.searchRecipes = CatchError(async (req, res, next) => {
    let { search, number } = req.query
    number = number || 1
    const results = await axios.get(
        SPOONACULAR_API_URL +
            '/recipes/complexSearch?apiKey=' +
            SPOONACULAR_API_KEY +
            '&query=' +
            search +
            '&addRecipeNutrition=true&number=' +
            number
    )
    if (results.statusText !== 'OK') next(new AppError('Bad request', 400))
    response(200, 'You successfuly recieved recipes', true, results?.data, res)
})

exports.getOneRecipe = CatchError(async (req, res, next) => {
    const { id } = req.params

    axios
        .get(SPOONACULAR_API_URL + '/recipes/' + id + '/nutritionWidget.json?apiKey=' + SPOONACULAR_API_KEY)
        .then((respone) => {
            const result = respone.data
            response(200, 'You successfully get recipe', true, { result }, res)
        })
})

exports.subsituteIngredients = CatchError(async (req, res, next) => {
    // igredient id
    const { id } = req.params
    const responseData = await axios.get(
        SPOONACULAR_API_URL + '/food/ingredients/' + id + '/substitutes/?apiKey=' + SPOONACULAR_API_KEY
    )
    const data = responseData.data
    response(200, data?.message, true, { ingredient: data.ingredient, substitutes: data.substitutes }, res)
})

exports.getIngredientInfo = CatchError(async (req, res, next) => {
    // ingredient id
    const { id } = req.params
    const { grams } = req.query
    const responseData = await axios.get(
        SPOONACULAR_API_URL +
            '/food/ingredients/' +
            id +
            '/information/?apiKey=' +
            SPOONACULAR_API_KEY +
            '&amount=' +
            grams +
            '&unit=grams'
    )
    const data = responseData.data
    response(200, 'successfully geted inforomation' + data.original, true, { data }, res)
})

exports.searchIngredients = CatchError(async (req, res, next) => {
    const { query } = req.query
    const data = await axios.get(
        SPOONACULAR_API_URL +
            '/food/ingredients/search?metaInformation=true&offset=0&number=10&query=' +
            query +
            '&apiKey=' +
            SPOONACULAR_API_KEY
    )

    response(200, 'You are successfully got data', true, { ingridients: data?.data }, res)
})

exports.addRecipe = CatchError(async (req, res, next) => {
    const {
        name,
        ingredients,
        fat,
        protein,
        calories,
        carbohydrates,
        proteinPercentage,
        fatPercentage,
        carbohydratesPercentage,
    } = req.body
    const userId = req.user.id
    const trainer = await Trainer.findOne({ where: { userId } })
    await Recipes.create({
        name,
        ingredients,
        fat,
        protein,
        calories,
        carbohydrates,
        proteinPercentage,
        fatPercentage,
        carbohydratesPercentage,
        nutritionistId: trainer.id,
    })
    response(200, 'You are successfully created recipe', true, '', res)
})
