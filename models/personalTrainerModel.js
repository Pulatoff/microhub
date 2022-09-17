const sequelize = require("../configs/db");
const { DataTypes, Sequelize } = require("sequelize");

const Personal_treiners = sequelize.define("personal_trainers", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  status: { type: DataTypes.BOOLEAN, allowNull: false },
  consumers: [
    { type: DataTypes.INTEGER, references: { model: "consumers", key: "id" } },
  ],
  credentials: { type: DataTypes.INTEGER, allowNull: false },
});

module.exports = Personal_treiners;
