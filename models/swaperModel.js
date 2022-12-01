const sequelize = require('../configs/db')
const { DataTypes } = require('sequelize')

const Dairy = require('./dairyModel')

const Swaper = sequelize.define(
    'swapers',
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        food_id: { type: DataTypes.INTEGER, allowNull: false },
        ingredient_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
        timestamps: true,
        createdAt: true,
        updatedAt: false,
    }
)

module.exports = Swaper
