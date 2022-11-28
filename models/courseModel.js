const { DataTypes } = require('sequelize')
// configs
const sequelize = require('../configs/db')
const Meal = require('./mealModel')

const Course = sequelize.define(
    'course',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        day: { type: DataTypes.STRING },
        week: { type: DataTypes.INTEGER },
    },
    {
        timestamps: true,
        createdAt: true,
        updatedAt: false,
    }
)
// Course.hasMany(Meal)
// Meal.belongsTo(Course)

module.exports = Course

const data = {
    day: 'Monday',
    breakfast: {
        meals: [
            {
                title: 'Niyozbek',
                cals: 13,
            },
        ],
    },
    dinner: {
        meals: [
            {
                title: 'Niyozbek',
                cals: 24,
            },
        ],
    },
    lunch: {
        meals: [
            {
                title: 'Niyozbek',
                cals: 45,
            },
        ],
    },
}
