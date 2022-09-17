const sequlize = require("../configs/db");
const { DataTypes, Sequelize } = require("sequelize");
const Dairy = require("../models/dairyModel");
const Goals = require("../models/goalModel");
const User = require("../models/userModel");

const Consumer = sequlize.define("consumers", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  weight: { type: DataTypes.FLOAT, allowNull: false },
  height: { type: DataTypes.FLOAT, allowNull: false },
  favourite_foods: { type: DataTypes.STRING },
  last_favourite_foods: { type: DataTypes.STRING },
  dairies: {
    type: DataTypes.INTEGER,
    references: { model: Dairy, key: "id" },
  },
  goals: {
    type: DataTypes.INTEGER,
    references: { model: Goals, key: "id" },
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: { model: User, key: "id" },
  },
  preferences: Sequelize.ENUM(
    "diet",
    "standard",
    "vegetarian",
    "lacto_vegetarian",
    "ovo_vegetarian",
    "vegan",
    "halal",
    "gluten_free",
    "kosher",
    "meat",
    "pescetarian",
    "pollotarian"
  ),
});
