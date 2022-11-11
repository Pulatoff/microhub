const sequlize = require('../configs/db')
const { DataTypes } = require('sequelize')
const User = require('../models/userModel')
const { body_fat, tdee, find_body_frame, healthy_weight, bmi, get_daily_targets } = require('../utils/FitnessPage')
const set_error = require('../utils/errorModel')
const activ_level_num = require('../utils/activLevelNum')

const Consumer = sequlize.define(
    'consumers',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        weight: { type: DataTypes.FLOAT, allowNull: false },
        height: { type: DataTypes.FLOAT, allowNull: false },
        favorite_foods: {
            type: DataTypes.STRING,
            get() {
                return this.getDataValue('favorite_foods').split(';')
            },
            set(val) {
                this.setDataValue('favorite_foods', val.join(';'))
            },
        },
        least_favorite_foods: {
            type: DataTypes.STRING,
            get() {
                return this.getDataValue('least_favorite_foods').split(';')
            },
            set(val) {
                this.setDataValue('least_favorite_foods', val.join(';'))
            },
        },
        gender: { type: DataTypes.ENUM('male', 'female', 'other'), allowNull: false },
        activity_level: {
            type: DataTypes.ENUM('sendentary', 'lightly active', 'moderate active', 'very active', 'extrmely active'),
            defaultValue: 'sendentary',
        },
        preferences: {
            type: DataTypes.ENUM(
                'diet',
                'standart',
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
                const daily = get_daily_targets(this.weight, this.tdee)
                return daily
            },
            set: set_error,
        },
    },
    {
        timestamps: true,
        createdAt: true,
        updatedAt: false,
    }
)

// referencing
User.hasOne(Consumer, { onDelete: 'CASCADE' })
Consumer.belongsTo(User, { onDelete: 'CASCADE' })

module.exports = Consumer
