const sequlize = require('../configs/db')
const { DataTypes, Sequelize, STRING } = require('sequelize')
const Dairy = require('../models/dairyModel')
const Goals = require('../models/goalModel')
const User = require('../models/userModel')
const { body_fat, tdee, find_body_frame, healthy_weight, bmi, get_daily_targets } = require('@presspage/fitnessjs')
const set_error = require('../utils/errorModel')

const Consumer = sequlize.define('consumers', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    weight: { type: DataTypes.FLOAT, allowNull: false },
    height: { type: DataTypes.FLOAT, allowNull: false },
    favourite_foods: { type: DataTypes.ARRAY(DataTypes.STRING) },
    last_favourite_foods: { type: DataTypes.ARRAY(DataTypes.STRING) },
    dairies: {
        type: DataTypes.INTEGER,
    },
    goals: {
        type: DataTypes.INTEGER,
    },
    gender: { type: DataTypes.STRING, allowNull: false },
    activity_level: {
        type: DataTypes.STRING,
        defaultValue: 'sendentary',
    },
    preferences: DataTypes.STRING,
    allergies: { type: DataTypes.ARRAY(DataTypes.STRING) },
    body_fat: {
        type: DataTypes.VIRTUAL,
        get() {
            const fat = body_fat(this.gender, this.weight, 10)
            return fat
        },
        set: set_error,
    },
    tdee: {
        type: DataTypes.VIRTUAL,
        get() {
            const activ_level = activ_level_num(this.activ_level)
            const tdee_result = tdee(1, this.gender, activ_level, this.height, this.weight, 24)
            return tdee_result
        },
        set: set_error,
    },
    body_frame: {
        type: DataTypes.VIRTUAL,
        get() {
            const body_frame = find_body_frame(1, this.gender, 10)
            return body_frame
        },
        set: set_error,
    },
    healthy_weight: {
        type: DataTypes.VIRTUAL,
        get() {
            const weight_healthy = healthy_weight(1, this.gender, this.height, this.body_frame)
            return weight_healthy
        },
        set: set_error,
    },
    bmi: {
        type: DataTypes.VIRTUAL,
        get() {
            const bmi_results = bmi(1, this.weight, this.height)
            return bmi_results
        },
        set: set_error,
    },
    daily_targets: {
        type: DataTypes.VIRTUAL,
        get() {
            console.log(this.tdee)
            const daily = get_daily_targets(this.weight, this.tdee)
            return daily
        },
        set: set_error,
    },
})

// referencing
User.hasOne(Consumer, { onDelete: 'CASCADE', as: 'user_id' })
Consumer.belongsTo(User, { onDelete: 'CASCADE', as: 'user_id' })

function activ_level_num(value) {
    switch (value) {
        case 'extrmely_active':
            return 1.9
        case 'very_active':
            return 1.725
        case 'moderate_active':
            return 1.55
        case 'lightly_active':
            return 1.375
        default:
            return 1.2
    }
}

module.exports = Consumer
