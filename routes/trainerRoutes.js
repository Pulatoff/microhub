const router = require('express').Router()
// controllers
const controller = require('../controllers/personalTrainersController')
const auth = require('../controllers/authController')
const consumerTrainer = require('../controllers/consumerTrainerController')
const questionaire = require('../controllers/questionaireController')
const upload = require('../controllers/uploadContoller')
const notes = require('../controllers/notesController')

// routes
router.route('/requests').get(auth.protect, controller.getAcceptConsumer)
router.route('/consumers').get(auth.protect, controller.getConsumers)
router.route('/consumer/accept').post(auth.protect, controller.acceptConsumer)
router.route('/consumer').post(auth.protect, auth.role(['nutritionist']), consumerTrainer.bindNutritionist)

router
    .route('/consumer/stats')
    .get(auth.protect, auth.role(['nutritionist', 'personal_trainer']), consumerTrainer.getAllConsumerStats)

router.route('/consumer/:id').get(auth.protect, consumerTrainer.getOneConsumer)

router
    .route('/consumers/:consumerId/notes')
    .post(auth.protect, auth.role(['nutritionist']), notes.addNotes)
    .get(auth.protect, auth.role(['nutritionist']), notes.getAllNotes)

router
    .route('/consumers/:consumerId/notes/:id')
    .get(auth.protect, auth.role(['nutritionist']), notes.getOneNote)
    .patch(auth.protect, auth.role(['nutritionist']), notes.updateNote)
    .delete(auth.protect, auth.role(['nutritionist']), notes.deletNote)

router.route('/questionnaire').get(auth.protect, auth.role(['nutritionist']), questionaire.getSendingQuestionnaire)
router.route('/search').get(consumerTrainer.searchEngine)

router
    .route('/uploads')
    .post(auth.protect, auth.role(['nutritionist']), upload.upload.single('file'), upload.uploadFile)
    .get(auth.protect, auth.role(['nutritionist']), upload.getUploads)

router
    .route('/uploads/:id')
    .patch(auth.protect, auth.role(['nutritionist']), upload.updateUploads)
    .delete(auth.protect, auth.role(['nutritionist']), upload.deleteUpload)

router.route('/:linkToken').get(controller.inviteConsumer)

module.exports = router
