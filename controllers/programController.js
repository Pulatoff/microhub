const Program = require('../models/programModel')
const AppError = require('../utils/AppError')
const Trainer = require('../models/personalTrainerModel')

exports.addProgram = async (req, res, next) => {
    try {
        const userId = req.user.id
        const trainer = await Trainer.findOne({ where: { userId } })
        console.log(trainer)
        const { course, serving, food_id, quantity, consumers } = req.body
        const program = await Program.create({
            course,
            serving,
            food_id,
            quantity,
            programsId: trainer.id,
            personalTrainerId: trainer.id,
        })
        res.status(200).json({ status: 'success', data: { program } })
    } catch (error) {
        console.log(error)
        next(AppError(error.message, 404))
    }
}

exports.updatePrograms = async (req, res, next) => {
    try {
        const userId = req.user.id
        const trainer = await Trainer.findOne({ where: { userId } })
        const program = await Program.update(req.body, { where: { programId: trainer.id, id: req.params.id } })
        res.status(200).json({
            status: 'success',
            data: { program },
        })
    } catch (error) {
        console.log(error)
        next(AppError(error.message, 404))
    }
}
