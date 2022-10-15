const Program = require('../models/programModel')
const AppError = require('../utils/AppError')
const Trainer = require('../models/personalTrainerModel')
const Consumer = require('../models/consumerModel')

exports.addProgram = async (req, res, next) => {
    try {
        const userId = req.user.id
        const trainer = await Trainer.findOne({ where: { userId } })
        console.log(trainer)
        const { course, serving, food_id, quantity, name, description } = req.body
        const program = await Program.create({
            course,
            serving,
            food_id,
            quantity,
            programsId: trainer.id,
            personalTrainerId: trainer.id,
            name,
            description,
        })
        res.status(200).json({ status: 'success', data: { program } })
    } catch (error) {
        console.log(error)
        next(AppError(error.message, 404))
    }
}

exports.updatePrograms = async (req, res, next) => {
    try {
        const program = await Program.update(req.body, { where: { id: req.params.id } })
        res.status(200).json({
            status: 'success',
            data: { program },
        })
    } catch (error) {
        console.log(error)
        next(AppError(error.message, 404))
    }
}

exports.getAllPrograms = async (req, res, next) => {
    const userId = req.user.id
    const consumer = await Consumer.findOne({ where: { userIdId: userId } })
    const programs = []
    for (let i = 0; i < 1; i++) {
        const program = await Program.findByPk(consumer.programs[i])
        console.log(program)
        programs.push(program)
    }
    res.json({
        status: 'success',
        data: { programs },
    })
}

exports.getProgram = async (req, res, next) => {
    const { id } = req.params
    const program = await Program.findByPk(id)
    res.status(200).json({
        status: 'success',
        data: { program },
    })
}
