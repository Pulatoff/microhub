const router = require('express').Router()
const controller = require('../controllers/programController')
const auth = require('../controllers/authController')
const bindController = require('../controllers/programConsumer')
const course = require('../controllers/courseController')

router
    .route('/')
    .post(auth.protect, auth.role(['admin', 'nutritionist']), controller.addProgram)
    .get(auth.protect, controller.getAllPrograms)

router.route('/recipes').post(auth.protect, course.addCourse)

router.route('/consumer').post(auth.protect, auth.role(['nutritionist', 'admin']), bindController.bindConumer)

router.route('/:id').get(auth.protect, controller.getProgram).patch(controller.updatePrograms)

module.exports = router
