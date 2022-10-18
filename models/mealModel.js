const sequelize = require('../configs/db')
const { DataTypes } = require('sequelize')

const Meals = sequelize.define('meals', {
    course: {
        type: DataTypes.ENUM('breakfast', 'brunch', 'lunch', 'snacks', 'dinner'),
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
})

module.exports = Meals
