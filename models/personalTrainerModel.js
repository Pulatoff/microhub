const sequelize = require('../configs/db')
const { DataTypes, Sequelize } = require('sequelize')
const User = require('../models/userModel')
const crypto = require('crypto')
const Consumer = require('../models/consumerModel')

const Personal_treiner = sequelize.define('personal_trainers', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    link: { type: DataTypes.STRING, allowNull: false },
    credentials: { type: DataTypes.INTEGER },
})

User.hasOne(Personal_treiner, { onDelete: 'CASCADE', as: 'user' })
Personal_treiner.belongsTo(User, { onDelete: 'CASCADE', as: 'user' })

Personal_treiner.hasMany(Consumer, { onDelete: 'CASCADE', as: 'consumers' })
Consumer.belongsTo(Personal_treiner, { onDelete: 'CASCADE', as: 'consumers' })

Personal_treiner.beforeCreate((user, options) => {
    const token = crypto.randomBytes(32).toString('hex')
    const hashToken = crypto.createHash('sha256').update(token).digest('hex')
    user.link = hashToken
})

module.exports = Personal_treiner
