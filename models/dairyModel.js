const { DataTypes } = require('sequelize')
const sequelize = require('../configs/db')
// models
const Program = require('./programModel')
const Consumer = require('./consumerModel')
const Recipe = require('./recipeModel')
const Meal = require('./programTimeModel')

const Dairy = sequelize.define(
    'diaries',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        course: { type: DataTypes.STRING, allowNull: false },
        cals: { type: DataTypes.INTEGER, allowNull: false },
        carbs: { type: DataTypes.INTEGER, allowNull: false },
        fat: { type: DataTypes.INTEGER, allowNull: false },
        protein: { type: DataTypes.INTEGER, allowNull: false },
    },
    { timestamps: true, createdAt: true, updatedAt: false }
)

Consumer.hasMany(Dairy)
Dairy.belongsTo(Consumer)

Meal.hasMany(Dairy)
Dairy.belongsTo(Meal)

module.exports = Dairy
