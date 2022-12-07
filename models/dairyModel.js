const { DataTypes } = require('sequelize')
const sequelize = require('../configs/db')
const Program = require('./programModel')
const Consumer = require('./consumerModel')

const Dairy = sequelize.define(
    'diaries',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        serving: { type: DataTypes.STRING, allowNull: false },
        quantity: { type: DataTypes.INTEGER, defaultValue: 0 },
        date: { type: DataTypes.DATE, allowNull: false },
        course: { type: DataTypes.STRING, allowNull: false },
    },
    {
        timestamps: true,
        createdAt: true,
        updatedAt: false,
    }
)

Program.hasMany(Dairy)
Dairy.belongsTo(Program)

Consumer.hasMany(Dairy)
Dairy.belongsTo(Consumer)

module.exports = Dairy
