const { DataTypes } = require('sequelize')
const sequelize = require('../configs/db')
const Course = require('./courseModel')

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

Dairy.hasMany(Course)
Course.belongsTo(Dairy)

module.exports = Dairy
