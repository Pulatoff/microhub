const { DataTypes, Sequelize } = require('sequelize')
const sequelize = require('../configs/db')
const Personal_Trainer = require('./personalTrainerModel')
const Meal = require('./mealModel')

const Program = sequelize.define(
    'programs',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING },
        description: { type: DataTypes.STRING },
    },
    {
        timestamps: true,
        createdAt: true,
        updatedAt: false,
    }
)

Personal_Trainer.hasMany(Program, { onDelete: 'CASCADE', as: 'programs' })
Program.belongsTo(Personal_Trainer, { onDelete: 'CASCADE', as: 'programs' })

Program.hasMany(Meal, { as: 'meals' })
Meal.belongsTo(Program, { as: 'meals' })

module.exports = Program
