const authController = require('../controllers/authController')
const route = require('express').Router()

route.route('/signup').post(authController.signup)

module.exports = route
