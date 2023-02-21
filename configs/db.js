const { Sequelize } = require('sequelize')

const dialect = 'mysql'

const sequelize = new Sequelize(process.env.PROD_DB_NAME, process.env.PROD_DB_USER, process.env.PROD_DB_PASSWORD, {
    dialect: dialect,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    logging: false,
})

module.exports = sequelize
