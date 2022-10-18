const { DataTypes } = require('sequelize')
const sequelize = require('../configs/db')
const Personal_Trainer = require('./personalTrainerModel')
const Meal = require('./mealModel')

const Program = sequelize.define(
    'programs',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.STRING },
    },
    {
        timestamps: true,
        createdAt: true,
        updatedAt: false,
    }
)

Personal_Trainer.hasMany(Program, { onDelete: 'CASCADE', as: 'nutritionist' })
Program.belongsTo(Personal_Trainer, { onDelete: 'CASCADE', as: 'nutritionist' })

Program.hasMany(Meal, { as: 'program' })
Meal.belongsTo(Program, { as: 'program' })

module.exports = Program
