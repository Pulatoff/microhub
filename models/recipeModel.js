const { DataTypes } = require('sequelize')
// configs
const sequelize = require('../configs/db')
const Consumer = require('./consumerModel')
// models
const Trainer = require('./personalTrainerModel')

const Recipe = sequelize.define(
    'recipes',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        calories: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
        carbohydrates: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
        carbohydratesPercentage: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
        fat: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
        fatPercentage: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
        proteinPercentage: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
        name: { type: DataTypes.STRING, allowNull: false },
        protein: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
        image_url: { type: DataTypes.TEXT },
        method: { type: DataTypes.TEXT, allowNull: true },
    },
    { timestamps: true, createdAt: true, updatedAt: false }
)

Trainer.hasMany(Recipe)
Recipe.belongsTo(Trainer)

module.exports = Recipe
