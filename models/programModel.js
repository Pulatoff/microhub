const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../configs/db");

const Program = sequelize.define("programs", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  course: {
    type: Sequelize.ENUM("breakfast", "brunch", "lunch", "snacks", "dinner"),
    allowNull: false,
  },
  quantity_id: {
    type: DataTypes.STRING,
  },
  serving_id: {
    type: DataTypes.STRING,
  },
  program_id: {
    type: DataTypes.STRING,
  },
});

module.exports = Program;
