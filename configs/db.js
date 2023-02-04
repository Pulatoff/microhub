const { Sequelize } = require('sequelize')

const dialect = 'mysql'

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    dialect: dialect,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    logging: false,
})

module.exports = sequelize
