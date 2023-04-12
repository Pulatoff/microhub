const sequelize = require('../configs/db')
const Ingredient = require('./ingredientModel')
const Dairy = require('./dairyModel')

const IngredientDairy = sequelize.define('ingredient_dairy', {}, { timestamps: false })

Ingredient.belongsToMany(Dairy, { through: IngredientDairy })
Dairy.belongsToMany(Ingredient, { through: IngredientDairy })

module.exports = IngredientDairy
