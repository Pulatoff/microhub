const sequelize = require('../configs/db')
const { DataTypes } = require('sequelize')
const Consumer = require('./consumerModel')

const ConsumerDetails = sequelize.define(
    'consumer_details',
    {
        weight: { type: DataTypes.FLOAT },
        height: { type: DataTypes.FLOAT },
        least_favorite_foods: {
            type: DataTypes.TEXT,
            get() {
                return this.getDataValue('least_favorite_foods').split(';')
            },
            set(val) {
                this.setDataValue('least_favorite_foods', val.join(';'))
            },
        },
        favorite_foods: {
            type: DataTypes.TEXT,
            get() {
                return this.getDataValue('favorite_foods').split(';')
            },
            set(val) {
                this.setDataValue('favorite_foods', val.join(';'))
            },
        },
        tdee: { type: DataTypes.FLOAT, allowNull: false },
    },
    { timestamps: true, createdAt: true, updatedAt: false }
)

Consumer.hasMany(ConsumerDetails)
ConsumerDetails.belongsTo(Consumer)

module.exports = ConsumerDetails
