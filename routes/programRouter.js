const router = require('express').Router()
const controller = require('../controllers/programController')
const authController = require('../controllers/authController')

router.route('/').post(authController.protect, authController.role(['admin', 'nutrisionist'], controller.addProgram))

module.exports = router
