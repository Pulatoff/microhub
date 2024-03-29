const router = require('express').Router()
// controllers
const controller = require('../controllers/dairesControler')
const auth = require('../controllers/authController')
const swap = require('../controllers/swaperController')

router
    .route('/')
    .post(auth.protect, auth.role(['consumer', 'admin']), controller.addDairy)
    .get(auth.protect, auth.role(['consumer', 'admin']), controller.getDairy)
    .patch(auth.protect, auth.role(['consumer']), controller.updateDairy)

router.route('/daily').post(auth.protect, auth.role(['consumer']), controller.getDairyDaily)

router
    .route('/:id')
    .get(auth.protect, auth.role(['consumer']), controller.getOneDairy)
    .delete(auth.protect, controller.deleteDairy)

router
    .route('/foods/:id')
    .patch(auth.protect, auth.role(['consumer']), controller.updateDairyFood)
    .delete(auth.protect, auth.role(['consumer']), controller.deleteDairyFood)

module.exports = router
