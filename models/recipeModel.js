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
        cals: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
        carbs: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
        fat: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
        name: { type: DataTypes.STRING, allowNull: false },
        protein: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
        imageUrl: { type: DataTypes.TEXT },
        isSaved: { type: DataTypes.BOOLEAN, defaultValue: true },
        method: { type: DataTypes.TEXT, allowNull: true },
    },
    { timestamps: true, createdAt: true, updatedAt: false }
)

Trainer.hasMany(Recipe)
Recipe.belongsTo(Trainer)

module.exports = Recipe
