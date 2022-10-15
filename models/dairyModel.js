const { DataTypes, Sequelize } = require('sequelize')
const sequelize = require('../configs/db')
const Program = require('../models/programModel')
const Consumer = require('./consumerModel')
const Dairy = sequelize.define('dairies', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    course: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.STRING,
    },
    serving: {
        type: DataTypes.STRING,
    },
    date:{type:DataTypes.STRING}
})

Program.hasOne(Dairy, { as: 'program' })
Dairy.belongsTo(Program, { as: 'program' })

Consumer.hasOne(Dairy, { as: 'consumer' })
Dairy.belongsTo(Consumer, { as: 'consumer' })

module.exports = Dairy
