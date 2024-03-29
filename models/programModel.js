const { DataTypes } = require('sequelize')
//configs
const sequelize = require('../configs/db')
// models
const Trainer = require('./personalTrainerModel')
const Meal = require('./programTimeModel')

const Program = sequelize.define(
    'programs',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.STRING },
        preference: { type: DataTypes.STRING },
        cals: { type: DataTypes.FLOAT, defaultValue: 0 },
        protein: { type: DataTypes.FLOAT, defaultValue: 0 },
        fat: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
        carbs: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
        weeks: { type: DataTypes.INTEGER, defaultValue: 1 },
        total_recipes: { type: DataTypes.INTEGER, defaultValue: 0 },
        image: { type: DataTypes.STRING, allowNull: true },
        image_url: { type: DataTypes.TEXT, allowNull: true },
    },
    {
        timestamps: true,
        createdAt: true,
        updatedAt: false,
    }
)

Trainer.hasMany(Program)
Program.belongsTo(Trainer)

Program.hasMany(Meal)
Meal.belongsTo(Program)

module.exports = Program
