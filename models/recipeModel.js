const { DataTypes } = require('sequelize')
// configs
const sequelize = require('../configs/db')
// models
const Trainer = require('./personalTrainerModel')

const Recipe = sequelize.define(
    'recipes',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        calories: { type: DataTypes.STRING, allowNull: false },
        carbohydrates: { type: DataTypes.STRING, allowNull: false },
        carbohydratesPercentage: { type: DataTypes.STRING, allowNull: false },
        fat: { type: DataTypes.STRING, allowNull: false },
        fatPercentage: { type: DataTypes.STRING, allowNull: false },
        proteinPercentage: { type: DataTypes.STRING, allowNull: false },
        name: { type: DataTypes.STRING, allowNull: false },
        protein: { type: DataTypes.STRING, allowNull: false },
        ingredients: { type: DataTypes.JSON, allowNull: false },
    },
    {
        timestamps: true,
        createdAt: true,
        updatedAt: false,
    }
)

Trainer.hasMany(Recipe)
Recipe.belongsTo(Trainer)

module.exports = Recipe
