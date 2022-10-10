const authController = require('../controllers/authController')
const route = require('express').Router()

route.route('/signup/client').post(authController.signupCLient)
route.route('/signup/nutritionist').post(authController.signupNutritionist)
route.route('/signup/trainer').post(authController.signupTrainer)
route.route('/signin').post(authController.signin)

module.exports = route
