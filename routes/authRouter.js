const authController = require('../controllers/authController')
const route = require('express').Router()

route.route('/signup').post(authController.signup)
route.route('/signin').post(authController.signin)

module.exports = route
