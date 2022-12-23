const User = require('../models/userModel')
// types
const { reqUserType, resUserType } = require('../types/userType')
// utils
const response = require('../utils/response')
const CatchError = require('../utils/catchErrorAsyncFunc')

exports.addUser = CatchError(async (req, res, next) => {
    const userData = reqUserType(req.body)
    const user = await User.create(userData)
    const newUser = resUserType(user)

    response(201, 'You are successfully created user', true, { user: newUser }, res)
})

exports.getUser = CatchError(async (req, res, next) => {
    const { id } = req.params
    const user = await User.findByPk(id)
    const newUser = resUserType(user)
    response(200, 'You are successfully get one user', true, { user: newUser }, res)
})
