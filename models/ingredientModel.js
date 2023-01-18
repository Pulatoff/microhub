const sequelize = require('../configs/db')
const { DataTypes } = require('sequelize')

const Ingredient = sequelize.define('ingredients', {
    name: {},
})
