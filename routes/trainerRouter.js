const router = require('express').Router()
const controller = require('../controllers/personalTrainers')
const auth = require('../controllers/authController')
const trainerInfo = require('../middlewares/TrainerInfo')
const consumerTrainer = require('../controllers/consumerTrainerRefernce')

router.route('/requests').get(auth.protect, controller.getAcceptConsumer)
router.route('/consumers').get(auth.protect, controller.getConsumers)
router.route('/consumer/accept').post(auth.protect, controller.acceptConsumer)
router.route('/consumer').post(auth.protect, trainerInfo, consumerTrainer.bindNutritionist)
router.route('/:linkToken').post(auth.protect, controller.bindConsumer)

module.exports = router
