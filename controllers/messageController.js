const response = require('../utils/response')
const Message = require('../models/messageModel')
const CatchError = require('../utils/catchErrorAsyncFunc')

exports.getMessages = CatchError(async (req, res, next) => {
    const room = req.params.room
    const messages = await Message.findAll({ where: { room_number: room } })
    response(200, 'You successfully get messages', true, { messages }, res)
})

exports.addMessage = CatchError(async (req, res, next) => {
    const message = req.body.message
    const room = req.params.room

    const newMessage = await Message.create({
        message,
        room_number: room,
        send_side: req.user.role,
        send_date: new Date(),
    })
    response(201, 'You successfully send message', true, { message: newMessage }, res)
})
