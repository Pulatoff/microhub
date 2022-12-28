const router = require('express').Router()
// controllers
const auth = require('../controllers/authController')
const controller = require('../controllers/recipeController')

router
    .route('/')
    .get(auth.protect, auth.role(['nutritionist', 'admin']), controller.getAllRecipes)
    .post(auth.protect, auth.role(['nutritionist', 'admin']), controller.addRecipe)
router.route('/search').get(auth.protect, controller.searchRecipes)
router.route('/ingredients/subsitutes/:id').get(controller.subsituteIngredients)
router.route('/ingredients/info/:id').get(controller.getIngredientInfo)
router.route('/ingredients/info').get(auth.protect, controller.searchIngredients)

router
    .route('/:id')
    .get(auth.protect, auth.role(['nutritionist', 'admin']), controller.getOneRecipe)
    .patch(auth.protect, auth.role(['nutritionist', 'admin']), controller.updateRecipes)
    .delete(auth.protect, auth.role(['nutritionist', 'admin']), controller.deleteRecipe)

module.exports = router
