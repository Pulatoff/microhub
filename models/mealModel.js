const sequelize = require('../configs/db')
const { DataTypes } = require('sequelize')
const Recipe = require('../models/recipeModel')

const Food = sequelize.define(
    'food_items',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        course: { type: DataTypes.ENUM(['breakfast', 'dinner', 'lunch', 'snacks']), allowNull: false },
        quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
        serving: { type: DataTypes.STRING, allowNull: false },
        title: { type: DataTypes.STRING, allowNull: false },
        image_url: { type: DataTypes.TEXT },
        fat: { type: DataTypes.FLOAT, defaultValue: 0 },
        cals: { type: DataTypes.FLOAT, defaultValue: 0 },
        carbs: { type: DataTypes.FLOAT, defaultValue: 0 },
        protein: { type: DataTypes.FLOAT, defaultValue: 0 },
        notes: { type: DataTypes.TEXT },
    },
    { timestamps: true, createdAt: true, updatedAt: false }
)

Recipe.hasMany(Food)
Food.belongsTo(Recipe)

module.exports = Food
