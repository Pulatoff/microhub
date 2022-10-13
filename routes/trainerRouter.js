const router = require('express').Router()
const controller = require('../controllers/personalTrainers')

router.route('/').get(controller.getAllTrainers)
router.route('/:id').patch(controller.updateTrainer)

module.exports = router
