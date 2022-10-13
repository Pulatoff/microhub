const ProgramConsumer = require('../models/ProgramConsumer')
const AppError = require('../utils/AppError')

exports.bindConumer = async (req, res, next) => {
    try {
        const { programId, consumers } = req.body
        const bindConsumers = await ProgramConsumer.create({ programId, consumers })
        res.json({
            data: {},
            status: 'success',
        })
    } catch (error) {
        console.log(error)
        next(new AppError(error.message, 404))
    }
}

exports.updateProgramBind = (req, res, next) => {
    const { id } = req.body
}
