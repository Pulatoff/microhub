const router = require('express').Router()
const controller = require('../controllers/personalTrainers')

router.route('/').get(controller.getAllTrainers)

module.exports = router
