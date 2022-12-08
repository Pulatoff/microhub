const router = require('express').Router()
// controllers
const controller = require('../controllers/consumerController')
const authController = require('../controllers/authController')
const bindConsumer = require('../controllers/consumerTrainerRefernce')
const questionaire = require('../controllers/questionaireController')
const bindProgram = require('../controllers/programConsumer')

router
    .route('/')
    .post(authController.protect, authController.role(['consumer']), controller.addConsumer)
    .get(authController.protect, authController.role(['consumer']), controller.getConsumer)
    .patch(authController.protect, controller.protectConsumer, controller.updateConsumer)

router
    .route('/trainer/accept')
    .post(
        authController.protect,
        authController.role(['consumer']),
        controller.protectConsumer,
        controller.acceptNutritioinst
    )

router
    .route('/questionnaire')
    .post(authController.protect, authController.role(['consumer']), questionaire.sendQuestionnaire)

router.route('/programs').get(authController.protect, authController.role(['consumer']), bindProgram.getPrograms)

router.route('/search').get(authController.protect, bindConsumer.searchConsumer)

router
    .route('/trainer')
    .post(authController.protect, controller.protectConsumer, bindConsumer.bindConsumer)
    .get(authController.protect, controller.getTrainers)

router.route('/trainers/request').get(authController.protect, controller.getRequestedTrainers)

module.exports = router
