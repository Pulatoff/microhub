const sequelize = require('../configs/db')
const { DataTypes } = require('sequelize')

const Meals = sequelize.define(
    'meals',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        course: { type: DataTypes.STRING },
        quantity: { type: DataTypes.INTEGER },
        serving: { type: DataTypes.STRING },
        food_id: { type: DataTypes.STRING, allowNull: false },
    },
    { timestamps: true, createdAt: true, updatedAt: false }
)

module.exports = Meals
