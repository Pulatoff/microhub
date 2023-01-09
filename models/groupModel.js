const sequelize = require('../configs/db')
const { DataTypes } = require('sequelize')
const Trainer = require('./personalTrainerModel')

const Group = sequelize.define(
    'groups',
    {
        name: { type: DataTypes.STRING, allowNull: false },
    },
    {
        timestamps: true,
        createdAt: true,
        updatedAt: false,
    }
)

Trainer.hasMany(Group)
Group.belongsTo(Trainer)

module.exports = Group
