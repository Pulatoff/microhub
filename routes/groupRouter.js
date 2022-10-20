const router = require('express').Router()
const controller = require('../controllers/groupController')
const auth = require('../controllers/authController')

router.route('/').post(auth.protect, controller.addGroup)

router.route('/consumer').post(auth.protect, controller.bindGroup)

module.exports = router
