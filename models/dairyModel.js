const { DataTypes } = require('sequelize')
const sequelize = require('../configs/db')
// models
const Consumer = require('./consumerModel')
const Food = require('./mealModel')

const Dairy = sequelize.define(
    'diaries',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        course: { type: DataTypes.STRING, allowNull: false },
        cals: { type: DataTypes.FLOAT, defaultValue: 0 },
        carbs: { type: DataTypes.FLOAT, defaultValue: 0 },
        fat: { type: DataTypes.FLOAT, defaultValue: 0 },
        protein: { type: DataTypes.FLOAT, defaultValue: 0 },
    },
    { timestamps: true, createdAt: true, updatedAt: false }
)

Consumer.hasMany(Dairy)
Dairy.belongsTo(Consumer)

Food.hasMany(Dairy)
Dairy.belongsTo(Food)

module.exports = Dairy
