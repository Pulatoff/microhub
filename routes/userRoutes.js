const authController = require('../controllers/authController')
const router = require('express').Router()
const controller = require('../controllers/userController')

router.route('/').post(controller.addUser).get(controller.getUsers)
router.route('/signup/client').post(authController.signupCLient)
router.route('/signup/nutritionist').post(authController.signupNutritionist)
router.route('/self').get(authController.protect, authController.usersSelf)
router.route('/signin').post(authController.signin)
router.route('/logout').get(authController.logout)
router.route('/:id').get(controller.getUser)

module.exports = router
