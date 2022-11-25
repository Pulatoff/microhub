const axios = require('axios')
// configs
const { SPOONACULAR_API_URL, SPOONACULAR_API_KEY } = require('../configs/URL')
// utils
const CatchError = require('../utils/catchErrorAsyncFunc')
const response = require('../utils/response')
const AppError = require('../utils/AppError')

exports.searchRecipes = CatchError(async (req, res, next) => {
    const { search } = req.query
    const results = await axios.get(
        SPOONACULAR_API_URL + '/recipes/complexSearch?apiKey=' + SPOONACULAR_API_KEY + '&query=' + search
    )
    if (results.statusText !== 'OK') next(new AppError('Bad request', 400))
    response(200, 'You successfuly recieved recipes', true, results?.data, res)
})

exports.getOneRecipe = CatchError(async (req, res, next) => {
    const { id } = req.params
    const query = req.query
    const values = Object.values(query)
    axios
        .get(SPOONACULAR_API_URL + '/recipes/' + id + '/nutritionWidget.json?apiKey=' + SPOONACULAR_API_KEY)
        .then((respone) => {
            const result = respone.data
            response(200, 'You successfully get recipe', true, { result }, res)
        })
})

exports.createMealPlanner = CatchError(async (req, res, next) => {
    const meal_planner = await axios.get(
        SPOONACULAR_API_URL +
            '/mealplanner/dsky/week/2020-06-01?hash=ipsum ea proident amet occaecat&apiKey=' +
            SPOONACULAR_API_KEY
    )
    console.log(meal_planner)
    response(200, 'all is good', true, {}, res)
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

// Search individual food  // COMPLETED
// calculate the food items and change them via volumes in grams (not number value: e.g. 300g of chicken tenders, not 6 chicken tenders)
// Display total macro count after food calculation in recipes
// Create and edit custom recipes
// Add non-recipe based food items
// Substitute ingredients // COMPLETED
// Apply created recipes to a mealplan for 1 week
// create, edit and delete meal plan templates.
// Assign said mealplans to a specific client of Nutritionist
