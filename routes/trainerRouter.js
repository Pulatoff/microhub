const router = require('express').Router()
const controller = require('../controllers/personalTrainers')
const auth = require('../controllers/authController')

router.route('/consumers').get(auth.protect, controller.getConsumers)

router.route('/:id').patch(controller.updateTrainer)

module.exports = router
