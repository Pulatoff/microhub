const sequelize = require('../configs/db')
const { DataTypes } = require('sequelize')
const Consumer = require('./consumerModel')
const Trainer = require('./personalTrainerModel')

const Notes = sequelize.define(
    'notes',
    {
        id: { primaryKey: true, type: DataTypes.INTEGER, autoIncrement: true },
        note: { type: DataTypes.TEXT, allowNull: false },
    },
    { timestamps: true, createdAt: true, updatedAt: false }
)

Consumer.hasMany(Notes)
Notes.belongsTo(Consumer)

Trainer.hasMany(Notes)
Notes.belongsTo(Trainer)

module.exports = Notes
