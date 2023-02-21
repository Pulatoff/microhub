const { DataTypes } = require('sequelize')
const sequelize = require('../configs/db')
//models
const Consumer = require('./consumerModel')
const Program = require('./programModel')

const ProgramConsumer = sequelize.define(
    'consumer_programs',
    {
        isAssigned: { type: DataTypes.BOOLEAN, defaultValue: false },
        sideAssign: { type: DataTypes.STRING, allowNull: true, defaultValue: 'nutritionist' },
    },
    { timestamps: false }
)

Consumer.belongsToMany(Program, { through: ProgramConsumer })
Program.belongsToMany(Consumer, { through: ProgramConsumer })

module.exports = ProgramConsumer
