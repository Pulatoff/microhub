const { DataTypes } = require('sequelize')
//configs
const sequelize = require('../configs/db')
// models
const Trainer = require('./personalTrainerModel')
const Course = require('./programTimeModel')

const Program = sequelize.define(
    'programs',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.STRING },
        preference: { type: DataTypes.STRING },
        cals: { type: DataTypes.INTEGER },
        protein: { type: DataTypes.INTEGER },
        fats: { type: DataTypes.INTEGER },
        carbs: { type: DataTypes.INTEGER },
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

Program.hasMany(Course)
Course.belongsTo(Program)

module.exports = Program
