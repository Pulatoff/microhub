const router = require('express').Router()
const controller = require('../controllers/dairesControler')
const auth = require('../controllers/authController')

router.route('/').post(auth.protect, controller.addDairy).get(auth.protect, controller.getDairy)
router.route('/:id').get(auth.protect, controller.getOneDairy).patch(auth.protect, controller.updateDairy)

module.exports = router
