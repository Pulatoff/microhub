const { DataTypes } = require('sequelize')
// configs
const sequelize = require('../configs/db')
const Food = require('./mealModel')

const Meal = sequelize.define(
    'meals',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        day: { type: DataTypes.STRING },
        week: { type: DataTypes.INTEGER },
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
