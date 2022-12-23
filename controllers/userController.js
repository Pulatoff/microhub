const User = require('../models/consumerModel')
// types
const { reqUserType } = require('../types/userType')
// utils
const response = require('../utils/response')
const CatchError = require('../utils/catchErrorAsyncFunc')

exports.addUser = CatchError(async (req, res, next) => {
    const userData = reqUserType(req.body)
    response(201, 'You are successfully created user', true, { userData }, res)
})
