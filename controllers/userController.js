const User = require('../models/userModel')
// utils
const response = require('../utils/response')
const CatchError = require('../utils/catchErrorAsyncFunc')

exports.addUser = CatchError(async (req, res, next) => {
    response(201, 'You are successfully created user', true, {}, res)
})

exports.getUser = CatchError(async (req, res, next) => {
    const { id } = req.params
    const { sort, page, limit } = req.query
    const user = await User.findByPk(id)
    // sort models ?sort=createdAt
    // selecting fields
    // pagination fields

    User.findAll({
        order: [], // for sorting
        attributes: { exclude: [] }, // fort selecting fields
        offset: 2,
        limit: 2,
    })
    response(200, 'You are successfully get one user', true, { user }, res)
})

exports.getUsers = CatchError(async (req, res, next) => {
    const { field } = req.query
    const fields = field.split(',')

    const attribute = {
        exclude: [],
        include: [],
    }

    fields.map((val) => {
        if (val.startsWith('-')) {
            attribute.exclude.push(val.slice(1))
        } else {
            attribute.include.push(val)
        }
    })

    const users = await User.findAll({
        order: [['id', 'DESC']],
        attributes: attribute,
        offset: 2,
        limit: 2,
    })
    response(200, 'You are successfully get all users', true, { users }, res)
})
