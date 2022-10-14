const router = require('express').Router()
const controller = require('../controllers/dairesControler')

router.route('/').post(controller.addDairy).get(controller.getDairy)

router.route('/:id').get(controller.getOneDairy).patch(controller.updateDairy)

module.exports = router
