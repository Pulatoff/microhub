const router = require('express').Router()
const controller = require('../controllers/personalTrainers')
const auth = require('../controllers/authController')

router.route('/consumers').get(auth.protect, controller.getConsumers)
router.route('/:linkToken').post(auth.protect, controller.bindConsumer)

module.exports = router
