const sequelize = require('../configs/db')
// models
const { DataTypes } = require('sequelize')

const Recipes = sequelize.define(
    'recipes',
    {
        id: { type: DataTypes.STRING, primaryKey: true, autoIncrement: true },
        calories: { type: DataTypes.STRING, allowNull: false },
        carbohydrates: { type: DataTypes.STRING, allowNull: false },
        carbohydratesPercentage: { type: DataTypes.STRING, allowNull: false },
        fat: { type: DataTypes.STRING, allowNull: false },
        fatPercentage: { type: DataTypes.STRING, allowNull: false },
        proteinPercentage: { type: DataTypes.STRING, allowNull: false },
        name: { type: DataTypes.STRING, allowNull: false },
        protein: { type: DataTypes.STRING, allowNull: false },
        ingredients: { type: DataTypes.STRING, allowNull: false },
    },
    {
        timestamps: true,
        createdAt: true,
        updatedAt: false,
    }
)

module.exports = Recipes
