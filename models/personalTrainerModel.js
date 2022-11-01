const sequelize = require('../configs/db')
const { DataTypes } = require('sequelize')
const User = require('../models/userModel')
const crypto = require('crypto')

const Personal_treiner = sequelize.define(
    'nutritionist',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        linkToken: { type: DataTypes.STRING },
        credentials: { type: DataTypes.INTEGER },
    },
    {
        timestamps: true,
        createdAt: true,
        updatedAt: false,
    }
)

User.hasOne(Personal_treiner, { onDelete: 'CASCADE' })
Personal_treiner.belongsTo(User, { onDelete: 'CASCADE' })

Personal_treiner.beforeCreate((user, options) => {
    const token = crypto.randomBytes(32).toString('hex')
    const hashToken = crypto.createHash('sha256').update(token).digest('hex')
    user.linkToken = hashToken
})

module.exports = Personal_treiner
