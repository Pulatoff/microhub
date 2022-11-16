const axios = require('axios')
// configs
const { SPOONACULAR_API_URL, SPOONACULAR_API_KEY } = require('../configs/URL')
// utils
const CatchError = require('../utils/catchErrorAsyncFunc')
const response = require('../utils/response')
const AppError = require('../utils/AppError')

exports.searchRecipes = CatchError(async (req, res, next) => {
    const { search } = req.params
    const results = await axios.get(
        SPOONACULAR_API_URL + '/recipes/complexSearch?apiKey=' + SPOONACULAR_API_KEY + '&query=' + search
    )
    if (results.statusText !== 'OK') next(new AppError('Bad request', 400))
    response(200, 'You successfuly recieved recipes', true, results?.data, res)
})
