const sequelize = require('../configs/db')
const { DataTypes } = require('sequelize')
const Dairy = require('./dairyModel')

const FoodConsumer = sequelize.define(
    'food_clients',
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false },
        cals: { type: DataTypes.INTEGER, allowNull: false },
        carbs: { type: DataTypes.INTEGER, allowNull: false },
        protein: { type: DataTypes.INTEGER, allowNull: false },
        fat: { type: DataTypes.INTEGER, allowNull: false },
        amount: { type: DataTypes.INTEGER, allowNull: false },
        unit: { type: DataTypes.STRING, allowNull: false, defaultValue: 'g' },
    },
    { timestamps: true, createdAt: true, updatedAt: false }
)

Dairy.hasMany(FoodConsumer)
FoodConsumer.belongsTo(Dairy)

module.exports = FoodConsumer
