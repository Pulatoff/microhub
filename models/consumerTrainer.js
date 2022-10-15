const sequelize = require('../configs/db')
const { DataTypes } = require('sequelize')

const ConsumerTrainer = sequelize.define('consumer_trainers', {
    consumer: { type: DataTypes.STRING },
    trainer: { type: DataTypes.STRING },
})

module.exports = ConsumerTrainer
