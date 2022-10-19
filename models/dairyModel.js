const { DataTypes } = require('sequelize')
const sequelize = require('../configs/db')
const Program = require('../models/programModel')
const Consumer = require('./consumerModel')
const Dairy = sequelize.define(
    'diaries',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        course: {
            type: DataTypes.ENUM('breakfast', 'brunch', 'lunch', 'snacks', 'dinner'),
            allowNull: false,
        },
        quantity: { type: DataTypes.STRING },
        food_id: { type: DataTypes.STRING, allowNull: false },
        serving: { type: DataTypes.STRING },
        date: { type: DataTypes.STRING },
    },
    {
        timestamps: true,
        createdAt: true,
        updatedAt: false,
    }
)

Program.hasOne(Dairy)
Dairy.belongsTo(Program)

Consumer.hasMany(Dairy)
Dairy.belongsTo(Consumer)

module.exports = Dairy
