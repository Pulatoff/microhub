const Swaper = require('../models/swaperModel')
const CatchError = require('../utils/catchErrorAsyncFunc')
const response = require('../utils/response')

exports.addSwapIngredient = CatchError(async (req, res, next) => {
    const { food_id, ingredient_id, swap_ingredient_id } = req.body
    const { diary_id } = req.params
    await Swaper.create({ food_id, ingredient_id, swap_ingredient_id })
    response(201, 'You are successfully swap ingredient', true, '', res)
})
