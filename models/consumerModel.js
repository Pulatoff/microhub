const sequlize = require('../configs/db')
const { DataTypes, Sequelize, STRING } = require('sequelize')
const Dairy = require('../models/dairyModel')
const Goals = require('../models/goalModel')
const User = require('../models/userModel')

const Consumer = sequlize.define(
    'consumers',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        weight: { type: DataTypes.FLOAT, allowNull: false },
        height: { type: DataTypes.FLOAT, allowNull: false },
        favourite_foods: { type: DataTypes.ARRAY(DataTypes.STRING) },
        last_favourite_foods: { type: DataTypes.ARRAY(DataTypes.STRING) },
        dairies: {
            type: DataTypes.INTEGER,
            references: { model: Dairy, key: 'id' },
        },
        goals: {
            type: DataTypes.INTEGER,
            references: { model: Goals, key: 'id' },
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: { model: User, key: 'id' },
            unique: { args: true, msg: 'this user already have been exist' },
        },
        gender: { type: Sequelize.ENUM('male', 'female', 'other'), allowNull: false },
        preferences: Sequelize.ENUM(
            'diet',
            'standard',
            'vegetarian',
            'lacto_vegetarian',
            'ovo_vegetarian',
            'vegan',
            'halal',
            'gluten_free',
            'kosher',
            'meat',
            'pescetarian',
            'pollotarian'
        ),
        allergies: { type: DataTypes.ARRAY(DataTypes.STRING) },
    },
    {
        indexes: [{ unique: true, fields: ['user_id'] }],
    }
)

module.exports = Consumer
