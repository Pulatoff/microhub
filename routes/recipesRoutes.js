const router = require('express').Router()
// controllers
const auth = require('../controllers/authController')
const controller = require('../controllers/recipeController')

router.route('/search').get(controller.searchRecipes)

module.exports = router
