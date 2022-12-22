const router = require('express').Router()
// controllers
const auth = require('../controllers/authController')
const controller = require('../controllers/recipeController')
const consumer = require('../controllers/consumerController')

router.route('/').get(auth.protect, controller.getAllRecipes).post(auth.protect, controller.addRecipe)
router.route('/search').get(auth.protect, controller.searchRecipes)
router.route('/ingredients/subsitutes/:id').get(controller.subsituteIngredients)
router.route('/ingredients/info/:id').get(controller.getIngredientInfo)
router.route('/ingredients/info').get(auth.protect, controller.searchIngredients)
router
    .route('/:id')
    .get(auth.protect, controller.getOneRecipe)
    .patch(auth.protect, controller.updateRecipes)
    .delete(auth.protect, controller.deleteRecipe)

module.exports = router
