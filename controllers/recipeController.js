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
    axios
        .get(SPOONACULAR_API_URL + '/recipes/' + id + '/nutritionWidget.json?apiKey=' + SPOONACULAR_API_KEY)
        .then((respone) => {
            const result = respone.data
            response(200, 'You successfully get recipe', true, { result }, res)
        })
})
