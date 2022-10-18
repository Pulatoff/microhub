const { DataTypes } = require('sequelize')
const sequelize = require('../configs/db')
const Program = require('../models/programModel')
const Consumer = require('./consumerModel')
const Dairy = sequelize.define('diaries', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    course: {
        type: DataTypes.ENUM('breakfast', 'brunch', 'lunch', 'snacks', 'dinner'),
        allowNull: false,
    },
    quantity: { type: DataTypes.STRING },
    serving: { type: DataTypes.STRING },
    date: { type: DataTypes.STRING },
})

Program.hasOne(Dairy, { as: 'diary' })
Dairy.belongsTo(Program, { as: 'program' })

Consumer.hasOne(Dairy, { as: 'diary' })
Dairy.belongsTo(Consumer, { as: 'diary' })

module.exports = Dairy
