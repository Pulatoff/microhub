const router = require('express').Router()
const controller = require('../controllers/consumerController')
const authController = require('../controllers/authController')

router
    .route('/')
    .post(authController.protect, controller.addConsumer)
    .get(authController.protect, controller.getConsumer)

router.route('/').get(controller.getConsumer)

module.exports = router
