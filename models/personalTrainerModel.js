const sequelize = require('../configs/db')
const { DataTypes, Sequelize } = require('sequelize')
const User = require('../models/userModel')

const Personal_treiner = sequelize.define('wp_personal_trainers', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    status: { type: DataTypes.BOOLEAN },
    consumers: {
        type: DataTypes.INTEGER,
        references: { model: 'consumers', key: 'id' },
    },
    credentials: { type: DataTypes.INTEGER },
})

User.hasOne(Personal_treiner, { onDelete: 'CASCADE', as: 'user' })
Personal_treiner.belongsTo(User, { onDelete: 'CASCADE', as: 'user' })

module.exports = Personal_treiner
