const router = require('express').Router()
// controllers
const auth = require('../controllers/authController')
const controller = require('../controllers/recipeController')

router
    .route('/')
    .get(auth.protect, auth.role(['consumer', 'nutritionist', 'admin']), controller.getAllRecipes)
    .post(
        auth.protect,
        auth.role(['consumer', 'nutritionist', 'admin']),
        controller.upload.single('image'),
        controller.addRecipe
    )

router.route('/self').get(auth.protect, auth.role(['consumer']), controller.getConsumerRecipes)
router.route('/random').get(controller.randomRecipes)
router.route('/search').get(auth.protect, controller.searchRecipes)
router.route('/ingredients/subsitutes').get(controller.subsituteIngredients)
router.route('/ingredients/info/:id').get(controller.getIngredientInfo)
router.route('/ingredients/info').get(controller.searchIngredients)

router
    .route('/:id')
    .get(auth.protect, auth.role(['consumer', 'nutritionist', 'admin']), controller.getOneRecipe)
    .patch(auth.protect, auth.role(['consumer', 'nutritionist', 'admin']), controller.updateRecipes)
    .delete(auth.protect, auth.role(['consumer', 'nutritionist', 'admin']), controller.deleteRecipe)

module.exports = router
