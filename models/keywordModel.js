const sequelize = require('../configs/db')

const { DataTypes } = require('sequelize')

const Keyword = sequelize.define(
    'keywords',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        keyword: { type: DataTypes.STRING, allowNull: false },
    },
    { timestamps: false }
)

module.exports = Keyword

// program => recipes => meals(SPOONACULAR API) => ingredients

// const programs = {
//     name: 'First Progam',
//     weeks: 123,
//     program_recipes: [
//         {
//             week: 1,
//             day: 0123456,
//             course: 'breakfast',
//         },
//     ],
// }
