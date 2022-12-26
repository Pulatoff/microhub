const User = require('../models/userModel')
// utils
const response = require('../utils/response')
const CatchError = require('../utils/catchErrorAsyncFunc')

exports.addUser = CatchError(async (req, res, next) => {
    response(201, 'You are successfully created user', true, {}, res)
})

exports.getUser = CatchError(async (req, res, next) => {
    const { id } = req.params
    const user = await User.findByPk(id)
    // sort models
    User.findAll({})
    response(200, 'You are successfully get one user', true, { user }, res)
})

exports.getUsers = CatchError(async (req, res, next) => {
    const users = await User.findAll({
        order: [['id', 'DESC']],
    })
    response(200, 'You are successfully get all users', true, { users }, res)
})
