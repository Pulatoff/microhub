const router = require('express').Router()
// controllers
const controller = require('../controllers/personalTrainers')
const auth = require('../controllers/authController')
const consumerTrainer = require('../controllers/consumerTrainerRefernce')
// middlewares
const trainerInfo = require('../middlewares/TrainerInfo')

router.route('/requests').get(auth.protect, controller.getAcceptConsumer)
router.route('/consumers').get(auth.protect, controller.getConsumers)
router.route('/consumer/accept').post(auth.protect, controller.acceptConsumer)
router.route('/consumer').post(auth.protect, trainerInfo, consumerTrainer.bindNutritionist)
router.route('/:linkToken').get(controller.inviteConsumer)

module.exports = router
