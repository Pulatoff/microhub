const Consumer = require('../models/consumerModel')
const Dairy = require('../models/dairyModel')
const Program = require('../models/programModel')
const AppError = require('../utils/AppError')

exports.addDairy = async (req, res, next) => {
    try {
        const { course, serving, food_id, date, quantity, programId } = req.body
        const userId = req.user.id
        const consumer = await Consumer.findOne({ where: { userId } })
        const diary = await Dairy.create({
            course,
            serving,
            date,
            food_id,
            quantity,
            programId,
            consumerId: consumer.id,
        })
        const newDiary = await Dairy.findByPk(diary.id, {
            attributes: ['id', 'serving', 'food_id', 'quantity', 'course', 'date'],
            include: [{ model: Program, attributes: ['id', 'name', 'description', 'createdAt'] }],
        })
        console.log(newDiary)
        res.status(200).json({
            status: 'success',
            data: {
                diary: newDiary,
            },
        })
    } catch (error) {
        next(new AppError(error.message, 404))
    }
}

exports.getDairy = async (req, res, next) => {
    try {
        const userId = req.user.id
        const consumer = await Consumer.findOne({ where: { userId } })
        const diaries = await Dairy.findAll({ where: { consumerId: consumer.id } })
        res.status(200).json({ status: 'success', data: { diaries } })
    } catch (error) {
        next(new AppError(error.message, 404))
    }
}

exports.getOneDairy = async (req, res, next) => {
    try {
        const userId = req.user.id
        const consumer = await Consumer.findOne({ where: { userId } })
        const diary = await Dairy.findByPk(req.params.id, { where: { consumerId: consumer.id } })
        if (!diary) next("This diary don't belongs to you")
        res.status(200).json({ status: 'success', data: { diary } })
    } catch (error) {
        next(new AppError(error.message, 404))
    }
}

exports.updateDairy = async (req, res, next) => {
    try {
        const userId = req.user.id
        const consumer = await Consumer.findOne({ where: { userId } })
        const diary = await Dairy.update(req.body, {
            where: { id: req.params.id, consumerId: consumer.id },
            returning: true,
            plain: true,
        })
        res.status(200).json({ status: 'success', data: { diary } })
    } catch (error) {
        next(new AppError(error.message, 404))
    }
}
