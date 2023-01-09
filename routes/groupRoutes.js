const router = require('express').Router()
const controller = require('../controllers/groupController')
const auth = require('../controllers/authController')

router.route('/').post(auth.protect, controller.addGroup).get(auth.protect, controller.getAllGroups)
router.route('/:id').get(auth.protect, controller.getOneGroup)

router.route('/consumer').post(auth.protect, controller.bindGroup)

module.exports = router
