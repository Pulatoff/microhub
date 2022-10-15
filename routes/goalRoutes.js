const router = require('express').Router()
const controller = require('../controllers/goalsController')
const authController = require('../controllers/authController')

router.route('/').post(authController.protect, controller.addGoal).get(authController.protect, controller.getAllGoals)
router
    .route('/:id')
    .get(authController.protect, controller.getOneGoal)
    .patch(authController.protect, controller.updateGoal)

module.exports = router
