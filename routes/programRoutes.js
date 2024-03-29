const router = require('express').Router()
const controller = require('../controllers/programController')
const auth = require('../controllers/authController')
const bindController = require('../controllers/programConsumerController')
const course = require('../controllers/courseController')
const swap = require('../controllers/swaperController')

router
    .route('/')
    .post(
        auth.protect,
        auth.role(['admin', 'nutritionist', 'consumer']),
        controller.upload.single('image'),
        controller.addProgram
    )
    .get(auth.protect, controller.getAllPrograms)

router
    .route('/self')
    .post(auth.protect, auth.role(['consumer']), controller.createSelfPorgam)
    .get(auth.protect, auth.role(['consumer']), controller.getAllProgramsConsumer)

router.route('/recipes').post(auth.protect, course.addCourse)

router.route('/consumer').post(auth.protect, auth.role(['nutritionist', 'admin']), bindController.bindConumer)
router.route('/consumer/self').post(auth.protect, auth.role(['consumer']), bindController.bindConumerSelf)

router.route('/search').get(auth.protect, auth.role(['nutritionist']), controller.searchPrograms)

router.route('/meals/:consumerId').get(auth.protect, auth.role(['nutritionist']), controller.getMeals)

router
    .route('/swaps')
    .get(swap.searchSwapIngredints)
    .post(auth.protect, auth.role(['consumer']), swap.addSwapIngredient)

router.route('/swaps/search').get(swap.searchIngredientToSwap)

router
    .route('/:id')
    .get(auth.protect, controller.getProgram)
    .patch(controller.updatePrograms)
    .delete(auth.protect, auth.role(['nutritionist']), controller.deletePrograms)

router.route('/:id/meals').post(auth.protect, controller.addMealToProgram)

module.exports = router
