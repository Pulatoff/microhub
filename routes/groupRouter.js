const router = require('express').Router()
const controller = require('../controllers/groupController')

router.route('/').post(controller.addGroup)

module.exports = router
