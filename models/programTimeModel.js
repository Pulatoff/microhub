const { DataTypes } = require('sequelize')
// configs
const sequelize = require('../configs/db')
const Meal = require('./mealModel')

const Course = sequelize.define(
    'mealplan_foods',
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
Course.hasMany(Meal)
Meal.belongsTo(Course)

module.exports = Course

const object = {
    day: 'Monday',
    week: 1,
    food_items: {
        breakfast: [
            {
                food_id: 1,
                serving: '150g',
                quantity: 23,
                title: 'Niyozbek',
            },
        ],
        dinner: [],
        lunch: [],
        snacks: [],
    },
}

const object2 = {
    day: 'Monday',
    week: 1,
    food_items: [
        {
            food_id: 1,
            serving: '150g',
            quantity: 23,
            title: 'Niyozbek',
        },
    ],
}

const object3 = {
    name: 'Niyozbek',
    description: 'deas smfkdol wefol FKOSDFdd',
}
