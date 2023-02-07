const sequelize = require('../configs/db')
const { DataTypes } = require('sequelize')
const Consumer = require('./consumerModel')

const ConsumerDetails = sequelize.define(
    'consumer_details',
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        weight: { type: DataTypes.FLOAT, allowNull: false },
        height: { type: DataTypes.FLOAT, allowNull: false },
        from_date: { type: DataTypes.DATE, allowNull: false },
        to_date: { type: DataTypes.DATE, allowNull: false },
    },
    { timestamps: true, createdAt: true, updatedAt: false }
)

Consumer.hasMany(ConsumerDetails)
ConsumerDetails.belongsTo(Consumer)

module.exports = ConsumerDetails
