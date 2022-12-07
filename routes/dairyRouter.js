const router = require('express').Router()
// controllers
const controller = require('../controllers/dairesControler')
const auth = require('../controllers/authController')
const consumer = require('../controllers/consumerController')
const swap = require('../controllers/swaperController')
router
    .route('/')
    .post(auth.protect, auth.role(['nutritionist']), controller.addDairy)
    .get(auth.protect, auth.role(['nutritionist']), controller.getDairy)
router
    .route('/:id')
    .get(auth.protect, auth.role(['nutritionist']), controller.getOneDairy)
    .patch(auth.protect, auth.role(['nutritionist']), controller.updateDairy)

router.route('/:diary_id/ingredient').post(auth.protect, swap.addSwapIngredient)

module.exports = router
