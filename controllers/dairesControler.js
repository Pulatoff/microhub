// models
const Consumer = require('../models/consumerModel')
const Dairy = require('../models/dairyModel')
const Program = require('../models/programModel')
const Swaper = require('../models/swaperModel')
const ConsumerProgram = require('../models/programConsumerModel')
// utils
const AppError = require('../utils/AppError')
const CatchError = require('../utils/catchErrorAsyncFunc')
const response = require('../utils/response')

exports.addDairy = CatchError(async (req, res, next) => {
    const { food_id, date, programId, serving, quantity, course } = req.body
    const userId = req.user.id
    const consumer = await Consumer.findOne({
        where: { userId },
    })
    const checkAssign = await ConsumerProgram.findOne({ where: { programId, consumerId: consumer.id } })
    if (!checkAssign) {
        next(new AppError(`You are not assigned to program by id ${programId}`, 400))
    }
    await Dairy.create({ quantity, serving, programId, date, food_id, course, consumerId: consumer.id })
    response(201, 'you successfully add your diaries', true, {}, res)
})

exports.getDairy = CatchError(async (req, res, next) => {
    const userId = req.user.id
    const consumer = await Consumer.findOne({ where: { userId } })

    const diaries = await Dairy.findAll({
        where: { consumerId: consumer.id },
        attributes: ['id', 'serving', 'course', 'quantity', 'course', 'date', 'createdAt'],
        include: [{ model: Program, attributes: ['id', 'name', 'description', 'createdAt'] }],
    })

    response(200, 'You are successfuly getting your diaries', true, { diaries }, res)
})

exports.getOneDairy = CatchError(async (req, res, next) => {
    const userId = req.user.id
    const consumer = await Consumer.findOne({ where: { userId } })

    const diary = await Dairy.findByPk(req.params.id, {
        where: { consumerId: consumer.id },
        attributes: ['id', 'serving', 'course', 'quantity', 'course', 'date', 'createdAt'],
        include: [{ model: Program, attributes: ['id', 'name', 'description', 'createdAt'] }, { model: Swaper }],
    })

    if (!diary) next("This diary don't belongs to you")
    response(200, 'You are successfully geting one diary', true, { diary }, res)
})

exports.updateDairy = CatchError(async (req, res, next) => {
    const userId = req.user.id
    const { date, course, food_id, quantity, serving } = req.body
    const consumer = await Consumer.findOne({ where: { userId } })
    const diary = await Dairy.findOne({
        where: { id: req.params.id, consumerId: consumer.id },
        attributes: ['id', 'date', 'course', 'food_id', 'quantity', 'serving'],
    })
    if (!diary) next(new AppError('this diary not found,please try again'))
    diary.date = date || diary.date
    diary.course = course || diary.course
    diary.food_id = food_id || diary.food_id
    diary.quantity = quantity || diary.quantity
    diary.serving = serving || diary.serving
    await diary.save()
    response(203, 'You are successfully update your diary', true, { diary }, res)
})
