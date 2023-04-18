const sequelize = require('../configs/db')
const { DataTypes } = require('sequelize')
const Dairy = require('./dairyModel')

const FoodConsumer = sequelize.define(
    'food_clients',
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false },
        cals: { type: DataTypes.FLOAT, allowNull: false },
        carbs: { type: DataTypes.FLOAT, allowNull: false },
        protein: { type: DataTypes.FLOAT, allowNull: false },
        fat: { type: DataTypes.FLOAT, allowNull: false },
        amount: { type: DataTypes.FLOAT, allowNull: false },
        unit: { type: DataTypes.STRING, allowNull: false, defaultValue: 'g' },
        image: { type: DataTypes.TEXT, allowNull: true },
    },
    { timestamps: true, createdAt: true, updatedAt: false }
)

Dairy.hasMany(FoodConsumer)
FoodConsumer.belongsTo(Dairy)

module.exports = FoodConsumer
