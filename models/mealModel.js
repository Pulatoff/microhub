const sequelize = require('../configs/db')
const { DataTypes } = require('sequelize')

const Meals = sequelize.define(
    'meals',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        course: { type: DataTypes.STRING, allowNull: false },
        quantity: { type: DataTypes.INTEGER, allowNull: false },
        serving: { type: DataTypes.STRING, allowNull: false },
        food_id: { type: DataTypes.STRING, allowNull: false },
        carbs: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        fats: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        cals: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        title: { type: DataTypes.STRING, allowNull: false },
        protein: { type: DataTypes.INTEGER, allowNull: false },
        image_url: { type: DataTypes.STRING },
    },
    { timestamps: true, createdAt: true, updatedAt: false }
)

module.exports = Meals
