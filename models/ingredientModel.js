const sequelize = require('../configs/db')
const { DataTypes } = require('sequelize')
const Recipe = require('./recipeModel')

const Ingredient = sequelize.define(
    'ingredients',
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false },
        spoon_id: { type: DataTypes.STRING, allowNull: false },
        amount: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
        unit: { type: DataTypes.STRING, allowNull: false },
        possibleUnits: {
            type: DataTypes.TEXT,
            allowNull: false,
            get() {
                return this.getDataValue('possibleUnits').split(';')
            },
            set(val) {
                this.setDataValue('possibleUnits', val.join(';'))
            },
        },
        image: { type: DataTypes.STRING, allowNull: false },
        cals: { type: DataTypes.FLOAT, allowNull: false },
        carbs: { type: DataTypes.FLOAT, allowNull: false },
        protein: { type: DataTypes.FLOAT, allowNull: false },
        fat: { type: DataTypes.FLOAT, allowNull: false },
    },
    { timestamps: true, createdAt: true, updatedAt: false }
)

Recipe.hasMany(Ingredient)
Ingredient.belongsTo(Recipe)

module.exports = Recipe
