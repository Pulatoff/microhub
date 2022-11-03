const router = require('express').Router()
// controllers
const controller = require('../controllers/dairesControler')
const auth = require('../controllers/authController')
const consumer = require('../controllers/consumerController')

router
    .route('/')
    .post(auth.protect, consumer.protectConsumer, controller.addDairy)
    .get(auth.protect, consumer.protectConsumer, controller.getDairy)
router
    .route('/:id')
    .get(auth.protect, consumer.protectConsumer, controller.getOneDairy)
    .patch(auth.protect, consumer.protectConsumer, controller.updateDairy)

module.exports = router
