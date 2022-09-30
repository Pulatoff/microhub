const { DataTypes, Sequelize } = require('sequelize')
const sequelize = require('../configs/db')
const Program = require('../models/programModel')
const Dairy = sequelize.define('dairies', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    course: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    quantity_id: {
        type: DataTypes.STRING,
    },
    serving_id: {
        type: DataTypes.STRING,
    },
    program_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: Program, key: 'id' },
    },
})

module.exports = Dairy
