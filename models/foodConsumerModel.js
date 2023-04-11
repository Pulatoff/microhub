const sequelize = require('../configs/db')
const { DataTypes } = require('sequelize')
const Dairy = require('./dairyModel')

const FoodConsumer = sequelize.define(
    'food_clients',
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        title: { type: DataTypes.STRING, allowNull: false },
        cals: { type: DataTypes.FLOAT, allowNull: false },
        carbs: { type: DataTypes.FLOAT, allowNull: false },
        protein: { type: DataTypes.FLOAT, allowNull: false },
        fat: { type: DataTypes.FLOAT, allowNull: false },
        amount: { type: DataTypes.FLOAT, allowNull: false },
        unit: { type: DataTypes.STRING, allowNull: false, defaultValue: 'g' },
    },
    { timestamps: true, createdAt: true, updatedAt: false }
)

Dairy.hasMany(FoodConsumer)
FoodConsumer.belongsTo(Dairy)

module.exports = FoodConsumer
