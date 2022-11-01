const authController = require('../controllers/authController')
const route = require('express').Router()

route.route('/signup/client').post(authController.signupCLient)
route.route('/signup/nutritionist').post(authController.signupNutritionist)
route.route('/self').get(authController.protect, authController.usersSelf)
route.route('/signin').post(authController.signin)

module.exports = route
