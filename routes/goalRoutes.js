const router = require('express').Router()
const controller = require('../controllers/goalsController')
const authController = require('../controllers/authController')

router
    .route('/')
    .post(authController.protect, authController.role(['consumer']), controller.addGoal)
    .get(authController.protect, authController.role(['consumer']), controller.getAllGoals)
router
    .route('/:id')
    .get(authController.protect, authController.role(['consumer']), controller.getOneGoal)
    .patch(authController.protect, authController.role(['consumer']), controller.updateGoal)

module.exports = router
