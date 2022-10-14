const router = require('express').Router()
const controller = require('../controllers/programController')
const authController = require('../controllers/authController')
const bindController = require('../controllers/programConsumer')

router
    .route('/')
    .post(
        authController.protect,
        authController.role(['admin', 'nutritionist', 'personal_trainer']),
        controller.addProgram
    )
    .get(authController.protect, controller.getAllPrograms)

router.route('/:id').get(controller.getProgram).patch(controller.updatePrograms)
router.route('/consumers').post(bindController.bindConumer)

module.exports = router
