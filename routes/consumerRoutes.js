const router = require('express').Router()
const controller = require('../controllers/consumerController')
const authController = require('../controllers/authController')
const bindConsumer = require('../controllers/consumerTrainerRefernce')

router
    .route('/')
    .post(authController.protect, controller.addConsumer)
    .get(authController.protect, controller.getConsumer)
    .patch(authController.protect, controller.protectConsumer, controller.updateConsumer)

router.route('/trainer/accept').post(authController.protect, controller.protectConsumer, controller.acceptNutritioinst)

router
    .route('/trainer')
    .post(authController.protect, controller.protectConsumer, bindConsumer.bindConsumer)
    .get(authController.protect, controller.getTrainers)

module.exports = router
