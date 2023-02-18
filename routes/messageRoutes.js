const router = require('express').Router()
const auth = require('../controllers/authController')
const controller = require('../controllers/messageController')

router
    .route('/:room')
    .get(auth.protect, auth.role(['consumer', 'nutritionist']), controller.getMessages)
    .post(auth.protect, auth.role(['consumer', 'nutritinionist']), controller.addMessage)

module.exports = router
