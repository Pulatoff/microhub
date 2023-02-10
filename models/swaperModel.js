const sequelize = require('../configs/db')
const { DataTypes } = require('sequelize')

const Food = require('./mealModel')
const Consumer = require('./consumerModel')

const Swaper = sequelize.define(
    'swapers',
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        ingredientId: { type: DataTypes.INTEGER, allowNull: false },
        swapIngredientId: { type: DataTypes.INTEGER, allowNull: false },
        ingredient_info: { type: DataTypes.JSON, allowNull: true },
    },
    { timestamps: true, createdAt: true, updatedAt: false }
)

Food.hasMany(Swaper)
Swaper.belongsTo(Food)

Consumer.hasMany(Swaper)
Swaper.belongsTo(Consumer)

sequelize.getQueryInterface

module.exports = Swaper
