const router = require('express').Router()
// controllers
const controller = require('../controllers/consumerController')
const authController = require('../controllers/authController')
const bindConsumer = require('../controllers/consumerTrainerController')
const questionaire = require('../controllers/questionaireController')
const bindProgram = require('../controllers/programConsumerController')

router
    .route('/')
    .post(authController.protect, authController.role(['consumer', 'admin']), controller.addConsumer)
    .get(authController.protect, authController.role(['nutritionist', 'admin']), controller.getConsumers)
    .patch(authController.protect, authController.role(['consumer', 'admin']), controller.updateConsumer)

router
    .route('/trainer/accept')
    .post(
        authController.protect,
        authController.role(['consumer', 'admin']),
        controller.protectConsumer,
        controller.acceptNutritioinst
    )

router
    .route('/questionnaire')
    .post(authController.protect, authController.role(['consumer', 'admin']), questionaire.sendQuestionnaire)

router
    .route('/questionnaire/:id')
    .patch(authController.protect, authController.role(['consumer', 'admin']), questionaire.updateQuestionaire)

router
    .route('/programs')
    .get(authController.protect, authController.role(['consumer', 'admin']), bindProgram.getPrograms)

router
    .route('/search')
    .get(authController.protect, authController.role(['admin', 'consumer']), bindConsumer.searchConsumer)

router
    .route('/trainer')
    .post(
        authController.protect,
        authController.role(['consumer']),
        controller.protectConsumer,
        bindConsumer.bindConsumer
    )
    .get(authController.protect, authController.role(['consumer']), controller.getTrainers)

router
    .route('/trainers/request')
    .get(authController.protect, authController.role(['consumer']), controller.getRequestedTrainers)

router
    .route('/:id')
    .get(
        authController.protect,
        authController.role(['personal_trainer', 'admin', 'nutritionist']),
        controller.getOneConsumer
    )

module.exports = router
