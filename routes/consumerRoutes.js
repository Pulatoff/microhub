const router = require('express').Router()
const controller = require('../controllers/consumerController')
const authController = require('../controllers/authController')
const bindConsumer = require('../controllers/consumerTrainerRefernce')

router
    .route('/')
    .post(authController.protect, controller.addConsumer)
    .get(authController.protect, controller.getConsumer)

router
    .route('/trainer')
    .post(authController.protect, controller.protectConsumer, bindConsumer.bindConsumer)
    .get(authController.protect, controller.getTrainers)

module.exports = router
