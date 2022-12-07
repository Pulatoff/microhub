const router = require('express').Router()
// controllers
const controller = require('../controllers/personalTrainers')
const auth = require('../controllers/authController')
const consumerTrainer = require('../controllers/consumerTrainerRefernce')
const questionaire = require('../controllers/questionaireController')
// middlewares
const trainerInfo = require('../middlewares/TrainerInfo')

// routes
router.route('/requests').get(auth.protect, controller.getAcceptConsumer)
router.route('/consumers').get(auth.protect, controller.getConsumers)
router.route('/consumer/accept').post(auth.protect, controller.acceptConsumer)
router.route('/consumer').post(auth.protect, auth.role(['nutritionist']), consumerTrainer.bindNutritionist)

router
    .route('/consumer/stats')
    .get(auth.protect, auth.role(['nutritionist', 'personal_trainer']), consumerTrainer.getAllConsumerStats)

router.route('/consumer/:id').get(auth.protect, consumerTrainer.getOneConsumer)

router.route('/questionnaire').get(auth.protect, auth.role(['nutritionist']), questionaire.getSendingQuestionnaire)
router.route('/search').get(consumerTrainer.searchEngine)

router.route('/:linkToken').get(controller.inviteConsumer)

module.exports = router
