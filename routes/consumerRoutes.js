const router = require('express').Router()
const controller = require('../controllers/consumerController')
const authController = require('../controllers/authController')
const bindConsumer = require('../controllers/consumerTrainer')
router
    .route('/')
    .post(authController.protect, controller.addConsumer)
    .get(authController.protect, controller.getConsumer)

router.route('/trainer').post(authController.protect, bindConsumer.bindConsumer)
router.route('/').get(controller.getConsumer)

module.exports = router
