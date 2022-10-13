const Program = require('../models/programModel')
const AppError = require('../utils/AppError')
const Trainer = require('../models/personalTrainerModel')

exports.addProgram = async (req, res, next) => {
    try {
        const userId = req.user.id
        const trainer = await Trainer.findOne({ where: { userId } })
        console.log(trainer)
        const { course, serving, food_id, quantity, consumers } = req.body
        const program = await Program.create({ course, serving, food_id, quantity, programId: trainer.id })
        res.status(200).json({ status: 'success', data: { program } })
    } catch (error) {
        console.log(error)
        next(AppError(error.message, 404))
    }
}

exports.updatePrograms = (req, res, next) => {
    const userId = req.user.id
}
