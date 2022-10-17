const sequelize = require('../configs/db')
const Consumer = require('./consumerModel')
const Program = require('./programModel')

const ProgramConsumer = sequelize.define('consumers_program', {}, { timestamps: false })

Consumer.belongsToMany(Program, { through: ProgramConsumer })
Program.belongsToMany(Consumer, { through: ProgramConsumer })

module.exports = ProgramConsumer
