const { DataTypes } = require('sequelize')
// configs
const sequelize = require('../configs/db')

const Questionnaire = sequelize.define(
    'questionnaries',
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false },
        date: { type: DataTypes.DATE, allowNull: false },
        date_of_birth: { type: DataTypes.DATE, allowNull: false },
        home_number: { type: DataTypes.STRING, allowNull: false },
        work_phone_number: { type: DataTypes.STRING, allowNull: false },
        height: { type: DataTypes.FLOAT, allowNull: false },
        weight: { type: DataTypes.FLOAT, allowNull: false },
        lowest_weight: { type: DataTypes.FLOAT, allowNull: false },
        lowest_height: { type: DataTypes.FLOAT, allowNull: false },
    },
    {
        timestamps: true,
        createdAt: true,
        updatedAt: false,
    }
)

module.exports = Questionnaire
