const router = require('express').Router()
const controller = require('../controllers/dairesControler')

router.route('/').post(controller.addDairy)

module.exports = router
