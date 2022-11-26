const router = require('express').Router()
// controllers
const controller = require('../controllers/dairesControler')
const auth = require('../controllers/authController')
const consumer = require('../controllers/consumerController')

router
    .route('/')
    .post(auth.protect, auth.role(['nutritionist']), controller.addDairy)
    .get(auth.protect, auth.role(['nutritionist']), controller.getDairy)
router
    .route('/:id')
    .get(auth.protect, auth.role(['nutritionist']), controller.getOneDairy)
    .patch(auth.protect, auth.role(['nutritionist']), controller.updateDairy)

module.exports = router
