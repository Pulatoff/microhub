const sequelize = require('../configs/db')
const { DataTypes } = require('sequelize')

const ProgramConsumer = sequelize.define('consumers_program', {
    programId: { type: DataTypes.INTEGER },
    consumers: { type: DataTypes.ARRAY(DataTypes.INTEGER) },
})

module.exports = ProgramConsumer
