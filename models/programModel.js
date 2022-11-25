const { DataTypes } = require('sequelize')
// configs
const sequelize = require('../configs/db')
// models
const Trainer = require('./personalTrainerModel')
const Diary = require('./dairyModel')

const Program = sequelize.define(
    'programs',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.STRING },
        preference: { type: DataTypes.STRING },
        weeks: { type: DataTypes.INTEGER },
    },
    {
        timestamps: true,
        createdAt: true,
        updatedAt: false,
    }
)

Trainer.hasMany(Program)
Program.belongsTo(Trainer)

Program.hasMany(Diary)
Diary.belongsTo(Program)

module.exports = Program
