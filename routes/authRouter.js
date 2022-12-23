const authController = require('../controllers/authController')
const router = require('express').Router()
const controller = require('../controllers/userController')

router.route('/').post(controller.addUser)
router.route('/signup/client').post(authController.signupCLient)
router.route('/signup/nutritionist').post(authController.signupNutritionist)
router.route('/self').get(authController.protect, authController.usersSelf)
router.route('/signin').post(authController.signin)
router.route('/logout').get(authController.logout)

module.exports = router
