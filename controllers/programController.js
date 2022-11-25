// models
const Program = require('../models/programModel')
const Trainer = require('../models/personalTrainerModel')
const Meal = require('../models/mealModel')
const Consumer = require('../models/consumerModel')
// utils
const CatchError = require('../utils/catchErrorAsyncFunc')
const AppError = require('../utils/AppError')
const response = require('../utils/response')

exports.addProgram = CatchError(async (req, res, next) => {
    const userId = req.user.id
    const trainer = await Trainer.findOne({ where: { userId } })
    const { name, description, preference } = req.body

    const program = await Program.create({ nutritionistId: trainer.id, name, description })

    response(
        201,
        'You are successfully added to program',
        true,
        {
            program: {
                id: program.id,
                name: program.name,
                description: program.description,
                createdAt: program.createdAt,
            },
        },
        res
    )
})

exports.getAllPrograms = CatchError(async (req, res, next) => {
    const userId = req.user.id

    const consumer = await Consumer.findOne({
        where: { userId },
        include: [
            {
                model: Program,
                attributes: ['name', 'id', 'description', 'createdAt'],
                include: [{ model: Meal, attributes: ['food_id', 'serving', 'quantity', 'course'] }],
            },
        ],
    })
    response(200, 'You are successfully geting programs', true, { programs: consumer.programs }, res)
})

exports.getProgram = CatchError(async (req, res, next) => {
    const { id } = req.params
    const program = await Program.findByPk(id, {
        include: [{ model: Meal, as: 'meals' }],
    })
    response(200, 'You are successfully geted one program', true, { program }, res)
})

exports.updatePrograms = CatchError(async (req, res, next) => {
    const { name, description } = req.body
    const userId = req.user.id
    const trainer = await Trainer.findOne({ where: { userId } })
    if (!trainer) next(new AppError("Tou don't access this query"))
    const program = await Program.findByPk(req.params.id, { where: { nutritionistId: trainer.id } })

    if (!program) next(new AppError('Program not found', 404))

    program.name = name || program.name
    program.description = description || program.description
    await program.save()
    response(
        203,
        'You are successfuly update program',
        true,
        { program: { name: program.name, description: program.description } },
        res
    )
})
