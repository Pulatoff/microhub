const { DataTypes } = require('sequelize')
// configs
const sequlize = require('../configs/db')
// models
const User = require('../models/userModel')
const Program = require('../models/programModel')
// utils
const set_error = require('../utils/errorModel')
const { body_fat, tdee, find_body_frame, healthy_weight, bmi, get_daily_targets } = require('../utils/FitnessPage')
const activ_level_num = require('../utils/activLevelNum')
// configs
const METRIC = +process.env.HEALTH_METRIC || 1
const Consumer = sequlize.define(
    'consumers',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        weight: { type: DataTypes.FLOAT, allowNull: false, validate: { isPositive } }, // unit in kg
        height: { type: DataTypes.FLOAT, allowNull: false, validate: { isPositive } }, // unit in cm
        favorite_foods: {
            type: DataTypes.TEXT,
            get() {
                return this.getDataValue('favorite_foods').split(';')
            },
            set(val) {
                this.setDataValue('favorite_foods', val.join(';'))
            },
        },
        least_favorite_foods: {
            type: DataTypes.TEXT,
            get() {
                return this.getDataValue('least_favorite_foods').split(';')
            },
            set(val) {
                this.setDataValue('least_favorite_foods', val.join(';'))
            },
        },
        wrist: { type: DataTypes.INTEGER, allowNull: false },
        forearm: { type: DataTypes.INTEGER, allowNull: false },
        hip: { type: DataTypes.INTEGER, allowNull: false },
        waist: { type: DataTypes.INTEGER, allowNull: false },
        gender: { type: DataTypes.ENUM('male', 'female', 'other'), allowNull: false },
        activity_level: {
            type: DataTypes.ENUM('sedentary', 'lightly active', 'moderate active', 'very active', 'extremely active'),
            defaultValue: 'sedentary',
        },
        preferences: {
            type: DataTypes.ENUM(
                'diet',
                'standard',
                'vegetarian',
                'lacto vegetarian',
                'ovo vegetarian',
                'vegan',
                'gluten free',
                'halal',
                'kosher',
                'meat',
                'pescetarian',
                'polltarian'
            ),
            allowNull: false,
        },
        allergies: {
            type: DataTypes.STRING,
            get() {
                return this.getDataValue('allergies').split(';')
            },
            set(val) {
                this.setDataValue('allergies', val.join(';'))
            },
        },
        body_fat: {
            type: DataTypes.VIRTUAL,
            get() {
                const fat = body_fat(this.gender, this.weight, this.wrist, this.waist, this.hip, this.forearm)
                return fat
            },
            set: set_error,
        },
        tdee: {
            type: DataTypes.VIRTUAL,
            get() {
                const activ_level = activ_level_num(this.activ_level)
                const tdee_result = tdee(METRIC, this.gender, activ_level, this.height, this.weight, 24)
                return tdee_result
            },
            set: set_error,
        },
        body_frame: {
            type: DataTypes.VIRTUAL,
            get() {
                const body_frame = find_body_frame(METRIC, this.gender, this.wrist)
                return body_frame
            },
            set: set_error,
        },
        healthy_weight: {
            type: DataTypes.VIRTUAL,
            get() {
                const weight_healthy = healthy_weight(METRIC, this.gender, this.height, this.body_frame)
                return weight_healthy
            },
            set: set_error,
        },
        bmi: {
            type: DataTypes.VIRTUAL,
            get() {
                const bmi_results = bmi(METRIC, this.weight, this.height)
                return bmi_results
            },
            set: set_error,
        },
        daily_targets: {
            type: DataTypes.VIRTUAL,
            get() {
                const daily = get_daily_targets(this.weight, this.tdee)
                return daily
            },
            set: set_error,
        },
        program_id: { type: DataTypes.INTEGER },
    },
    {
        timestamps: true,
        createdAt: true,
        updatedAt: false,
    }
)

function isPositive(val) {
    if (val <= 0) {
        throw new Error(`You need enter positive number to field ${val}`)
    }
}

// referencing
User.hasOne(Consumer)
Consumer.belongsTo(User)

// Program.hasOne(Consumer)
// Consumer.belongsTo(Program)

module.exports = Consumer
