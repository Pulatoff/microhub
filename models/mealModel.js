const sequelize = require('../configs/db')
const { DataTypes } = require('sequelize')
const Recipe = require('../models/recipeModel')

const Food = sequelize.define(
    'food_items',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        course: { type: DataTypes.ENUM(['breakfast', 'dinner', 'lunch', 'snacks']), allowNull: false }, // enums breakfast,  lunch, dinner, snacks
        quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
        serving: { type: DataTypes.STRING, allowNull: false },
        title: { type: DataTypes.STRING, allowNull: false },
        image_url: { type: DataTypes.TEXT },
    },
    { timestamps: true, createdAt: true, updatedAt: false }
)

Recipe.hasMany(Food)
Food.belongsTo(Recipe)

module.exports = Food
