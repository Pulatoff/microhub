const ProgramConsumer = require('../models/ProgramConsumer')
const AppError = require('../utils/AppError')
const Consumer = require('../models/consumerModel')

exports.bindConumer = async (req, res, next) => {
    try {
        const { programId } = req.body
        const consumers = req.body.consumer
        const consumer = await Consumer.findByPk(consumers)
        const programs = consumer.programs ? [...consumer.programs, programId] : [programId]
        consumer.update({ programs })
        consumer.save()

        await ProgramConsumer.create({ programId, consumers })
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
