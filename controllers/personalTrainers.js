const Trainer = require('../models/personalTrainerModel')
const User = require('../models/userModel')
const Consumer = require('../models/consumerModel')

exports.getAllTrainers = async (req, res, next) => {
    const trainer = await Trainer.findAll({
        include: [
            { model: User, as: 'user' },
            { model: Consumer, as: 'consumers' },
        ],
    })
    res.status(200).json({
        trainer,
    })
}

exports.updateTrainer = async (req, res, next) => {}
