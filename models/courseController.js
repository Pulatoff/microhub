const sequelize = require('../configs/db')
const { DataTypes } = require('sequelize')

const Course = sequelize.define(
    'courses',
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false },
    },
    { timestamps: flase }
)

module.exports = Course
