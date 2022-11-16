const router = require('express').Router()
// controllers
const auth = require('../controllers/authController')
const controller = require('../controllers/recipeController')
const consumer = require('../controllers/consumerController')

router.route('/search').get(auth.protect, consumer.protectConsumer, controller.searchRecipes)

module.exports = router
