const { DataTypes } = require('sequelize')
const sequelize = require('../configs/db')
// models
const Consumer = require('./consumerModel')
const Trainer = require('./personalTrainerModel')

const BindTrack = sequelize.define(
    'consumer_trainer_tracks',
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        status: { type: DataTypes.INTEGER, allowNull: false },
    },
    { timestamps: true, createdAt: true, updatedAt: false }
)

Consumer.hasMany(BindTrack)
BindTrack.belongsTo(Consumer)

Trainer.hasMany(BindTrack)
BindTrack.belongsTo(Trainer)

module.exports = BindTrack
