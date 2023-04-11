const { DataTypes } = require('sequelize')
const sequelize = require('../configs/db')
// models
const Program = require('./programModel')
const Consumer = require('./consumerModel')
const Recipe = require('./recipeModel')

const Dairy = sequelize.define(
    'diaries',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        course: { type: DataTypes.STRING, allowNull: false },
    },
    { timestamps: true, createdAt: true, updatedAt: false }
)

Program.hasMany(Dairy)
Dairy.belongsTo(Program)

Consumer.hasMany(Dairy)
Dairy.belongsTo(Consumer)

Recipe.hasMany(Dairy)
Dairy.belongsTo(Recipe)

module.exports = Dairy
