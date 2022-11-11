const router = require('express').Router()
const controller = require('../controllers/programController')
const auth = require('../controllers/authController')
const bindController = require('../controllers/programConsumer')

router
    .route('/')
    .post(auth.protect, auth.role(['admin', 'nutritionist']), controller.addProgram)
    .get(auth.protect, controller.getAllPrograms)

router.route('/:id').get(controller.getProgram).patch(controller.updatePrograms)
router.route('/consumer').post(auth.protect, auth.role(['nutritionist', 'admin']), bindController.bindConumer)

module.exports = router
