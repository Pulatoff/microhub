const { DataTypes, Sequelize } = require('sequelize')
const sequelize = require('../configs/db')
const Personal_Trainer = require('./personalTrainerModel')
const Consumers = require('./consumerModel')
const Program = sequelize.define(
    'programs',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        course: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
        },
        serving: {
            type: DataTypes.STRING,
        },
        food_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        timestamps: true,
        createdAt: true,
        updatedAt: false,
    }
)

Personal_Trainer.hasMany(Program, { onDelete: 'CASCADE', as: 'programs' })
Program.belongsTo(Personal_Trainer, { onDelete: 'CASCADE', as: 'programs' })

Program.hasMany(Consumers, { as: 'consumers' })
Consumers.belongsTo(Program, { as: 'consumers' })

module.exports = Program
