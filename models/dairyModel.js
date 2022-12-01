const { DataTypes } = require('sequelize')
const sequelize = require('../configs/db')
const Program = require('./programModel')

const Dairy = sequelize.define(
    'diaries',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        serving: { type: DataTypes.STRING },
        quantity: { type: DataTypes.INTEGER },
        date: { type: DataTypes.DATE },
        course: { type: DataTypes.STRING },
    },
    {
        timestamps: true,
        createdAt: true,
        updatedAt: false,
    }
)

Program.hasMany(Dairy)
Dairy.belongsTo(Program)

module.exports = Dairy
