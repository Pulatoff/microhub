const Dairy = require('../models/dairyModel')
const AppError = require('../utils/AppError')

exports.addDairy = async (req, res, next) => {
    try {
        const { course, serving, food_id, quantity, programId } = req.body
        const dairy = await Dairy.create({
            course,
            serving,
            food_id,
            quantity,
            programId,
        })
        res.status(200).json({ status: 'success', data: { dairy } })
    } catch (error) {
        console.log(error)
        next(new AppError(error.message, 404))
    }
}

exports.getDairies = async (req, res, next) => {
    try {
        const { course, serving, food_id, quantity, programId } = req.body
        const dairies = await Dairy.create({
            course,
            serving,
            food_id,
            quantity,
            programId,
        })
        res.status(200).json({ status: 'success', data: { dairies } })
    } catch (error) {
        console.log(error)
        next(new AppError(error.message, 404))
    }
}

exports.getDairy = async (req, res, next) => {
    try {
        const dairies = await Dairy.findAll()
        res.status(200).json({ status: 'success', data: { dairies } })
    } catch (error) {
        console.log(error)
        next(new AppError(error.message, 404))
    }
}

exports.getOneDairy = async (req, res, next) => {
    try {
        const dairies = await Dairy.findByPk(req.params.id)
        res.status(200).json({ status: 'success', data: { dairies } })
    } catch (error) {
        console.log(error.message)
        next(new AppError(error.message, 404))
    }
}

exports.updateDairy = async (req, res, next) => {
    try {
        const dairy = await Dairy.update(req.body, { where: { id: req.params.id }, returning: true, plain: true })
        res.status(200).json({ status: 'success', data: { dairy } })
    } catch (error) {
        console.log(error)
        next(new AppError(error.message, 404))
    }
}
