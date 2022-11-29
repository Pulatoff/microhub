const { DataTypes } = require('sequelize')
const sequelize = require('../configs/db')
const Course = require('./programTimeModel')

const Dairy = sequelize.define(
    'diaries',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        day: { type: DataTypes.STRING },
        week: { type: DataTypes.INTEGER },
    },
    {
        timestamps: true,
        createdAt: true,
        updatedAt: false,
    }
)

module.exports = Dairy
