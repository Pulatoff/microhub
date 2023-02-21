const { DataTypes } = require('sequelize')
const sequelize = require('../configs/db')
const Consumer = require('./consumerModel')
const Trainer = require('./personalTrainerModel')
const crypto = require('crypto')

const ConsumerTrainer = sequelize.define(
    'consumer_trainers',
    {
        status: { type: DataTypes.INTEGER, defaultValue: 0 },
        statusClient: { type: DataTypes.ENUM('active', 'inactive', 'awaiting meals'), defaultValue: 'awaiting meals' },
        room_number: { type: DataTypes.STRING },
        invate_side: { type: DataTypes.ENUM('profesional', 'client') },
    },
    { timestamps: false }
)

Consumer.belongsToMany(Trainer, { through: ConsumerTrainer })
Trainer.belongsToMany(Consumer, { through: ConsumerTrainer })

module.exports = ConsumerTrainer
