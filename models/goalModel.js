const sequelize = require('../configs/db')
const { DataTypes } = require('sequelize')
const Consumer = require('../models/consumerModel')

const Goals = sequelize.define('goals', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    protein: { type: DataTypes.FLOAT },
    carbohydrates: { type: DataTypes.FLOAT },
    fats: { type: DataTypes.FLOAT },
    calories: { type: DataTypes.FLOAT },
    start_date: { type: DataTypes.STRING, allowNull: false },
    end_date: { type: DataTypes.STRING, allowNull: false },
})

Consumer.hasMany(Goals, { as: 'goal' })
Goals.belongsTo(Consumer, { as: 'goal' })

module.exports = Goals
