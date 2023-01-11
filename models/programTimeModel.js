const { DataTypes } = require('sequelize')
// configs
const sequelize = require('../configs/db')
const Food = require('./mealModel')

const Meal = sequelize.define(
    'meals',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        day: { type: DataTypes.INTEGER, defaultValue: 0 },
        week: { type: DataTypes.INTEGER, defaultValue: 1 },
        cals: { type: DataTypes.INTEGER, defaultValue: 0 },
        carbs: { type: DataTypes.INTEGER, defaultValue: 0 },
        fat: { type: DataTypes.INTEGER, defaultValue: 0 },
        protein: { type: DataTypes.INTEGER, defaultValue: 0 },
    },
    {
        timestamps: true,
        createdAt: true,
        updatedAt: false,
    }
)

Meal.hasMany(Food)
Food.belongsTo(Meal)

module.exports = Meal
