// models
const Trainer = require('../models/personalTrainerModel')
const ConsumerTrainer = require('../models/consumerTrainer')

module.exports = async ({ invitationToken, consumerId }) => {
    const trainer = await Trainer.findOne({ where: { linkToken: invitationToken } })
    if (trainer) {
        await ConsumerTrainer.create({ nutritionistId: trainer.id, consumerId, status: 1 })
    }
}
