const Program = require('../models/programModel')
const AppError = require('../utils/AppError')

exports.addProgram = async (req, res, next) => {
    try {
        const { course, serving, food_id, quantity } = req.body
        const program = await Program.create({ course, serving, food, quantity })
        res.status(200).json({ status: 'success', data: { program } })
    } catch (error) {
        next(AppError(error.message, 404))
    }
}
