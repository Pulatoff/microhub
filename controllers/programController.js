const Program = require('../models/programModel')
const AppError = require('../utils/AppError')
const Trainer = require('../models/personalTrainerModel')
const Meal = require('../models/mealModel')
const Consumer = require('../models/consumerModel')

exports.addProgram = async (req, res, next) => {
    try {
        const userId = req.user.id
        const trainer = await Trainer.findOne({ where: { userId } })
        const { meals, name, description } = req.body
        const program = await Program.create({
            nutritionistId: trainer.id,
            name,
            description,
        })
        for (let i = 0; i < meals.length; i++) {
            await Meal.create({ ...meals[i], programId: program.id })
        }

        const createdMeals = await Meal.findAll({
            where: { programId: program.id },
            attributes: ['course', 'quantity', 'serving', 'food_id'],
        })

        res.status(200).json({
            status: 'success',
            data: {
                program: {
                    id: program.id,
                    name: program.name,
                    description: program.description,
                    meals: createdMeals,
                    createdAt: program.createdAt,
                },
            },
        })
    } catch (error) {
        next(new AppError(error.message, 404))
    }
}

exports.updatePrograms = async (req, res, next) => {
    try {
        const program = await Program.update(req.body, { where: { id: req.params.id }, returning: true, plain: true })
        res.status(200).json({ status: 'success', data: { program } })
    } catch (error) {
        next(AppError(error.message, 404))
    }
}

exports.getAllPrograms = async (req, res, next) => {
    try {
        const userId = req.user.id

        const consumer = await Consumer.findAll({
            where: { userId },
            include: [
                {
                    model: Program,
                    attributes: ['name', 'id', 'description', 'createdAt'],
                    include: [{ model: Meal, attributes: ['food_id', 'serving', 'quantity', 'course'] }],
                },
            ],
        })

        res.json({ status: 'success', data: { programs: consumer.programs } })
    } catch (error) {
        next(new AppError(error.message, 404))
    }
}

exports.getProgram = async (req, res, next) => {
    try {
        const { id } = req.params
        const program = await Program.findByPk(id, {
            include: [
                {
                    model: Meal,
                    as: 'meals',
                },
            ],
        })
        res.status(200).json({
            status: 'success',
            data: { program },
        })
    } catch (error) {
        next(new AppError(error.message, 404))
    }
}
