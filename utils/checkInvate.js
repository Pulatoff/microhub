// models
const Trainer = require('../models/personalTrainerModel')
const ConsumerTrainer = require('../models/consumerTrainer')
// utlis
const CatchError = require('./catchErrorAsyncFunc')

module.exports = CatchError(async ({ invitationToken, consumerId }) => {
    const trainer = await Trainer.findOne({ where: { linkToken: invitationToken } })
    if (trainer) {
        await ConsumerTrainer.create({ trainerId: trainer.id, consumerId, status: 1 })
    }
})
