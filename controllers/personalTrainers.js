const Trainer = require('../models/personalTrainerModel')
const User = require('../models/userModel')
const Consumer = require('../models/consumerModel')
const sequelize = require('../configs/db')
const trainerConsumer = sequelize.define('TrainerConsumers')
const Program = require('../models/programModel')
const ConsumerTrainer = require('../models/consumerTrainer')

exports.getAllTrainers = async (req, res, next) => {
    const trainer = await Trainer.findAll({
        include: [
            { model: User, as: 'user' },
            { model: Program, as: 'programs' },
        ],
    })
    const nmadir = await trainerConsumer.create({
        consumersId: 1,
        personal_trainersId: 1,
    })
    console.log(nmadir)
    res.status(200).json({
        trainer,
    })
}

exports.updateTrainer = async (req, res, next) => {
    const { id } = req.params

    const updateTrainer = Trainer.update(req.body, { where: { id } })
    res.status(200).json({ updateTrainer })
}

exports.getConsumers = async (req, res, next) => {
    const userId = req.user.id
    const trainer = await Trainer.findOne({ where: { userId } })
    const consumers = await ConsumerTrainer.findAll({ where: { trainer: `${trainer.id}` } })
    const newConsumers = []
    for (let i = 0; i < consumers.length; i++) {
        const consumer = await Consumer.findByPk(consumers[i].consumer)
        newConsumers.push(consumer)
    }
    res.status(200).json({
        status: 'success',
        data: { consumers: newConsumers },
    })
}
