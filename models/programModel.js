const { DataTypes, Sequelize } = require('sequelize')
const sequelize = require('../configs/db')

const Program = sequelize.define(
    'programs',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        course: {
            type: Sequelize.ENUM('breakfast', 'brunch', 'lunch', 'snacks', 'dinner'),
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
        nutrinionist_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        timestamps: true,
        createdAt: true,
        updatedAt: false,
    }
)

module.exports = Program
