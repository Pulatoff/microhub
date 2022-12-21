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
        cals: { type: DataTypes.INTEGER, defaultValue: 0 },
        protein: { type: DataTypes.INTEGER, defaultValue: 0 },
        fats: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        carbs: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        weeks: { type: DataTypes.INTEGER, defaultValue: 1 },
        total_recipes: { type: DataTypes.INTEGER },
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
