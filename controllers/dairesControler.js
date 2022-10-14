const Dairy = require('../models/dairyModel')

exports.addDairy = async (req, res, next) => {
    const { course, serving, food_id, quantity, programId } = req.body
    const program = await Dairy.create({
        course,
        serving,
        food_id,
        quantity,
        programId,
    })
    res.status(200).json({ status: 'success', data: { program } })
}

exports.getDairies = async (req, res, next) => {
    const { course, serving, food_id, quantity, programId } = req.body
    const dairies = await Dairy.create({
        course,
        serving,
        food_id,
        quantity,
        programId,
    })
    res.status(200).json({ status: 'success', data: { dairies } })
}

exports.getDairy = async (req, res, next) => {
    const dairies = await Dairy.findAll()
    res.status(200).json({ status: 'success', data: { dairies } })
}

exports.getOneDairy = async (req, res, next) => {
    const dairies = await Dairy.findByPk(req.params.id)
    res.status(200).json({ status: 'success', data: { dairies } })
}
