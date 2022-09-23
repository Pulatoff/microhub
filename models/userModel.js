const sequelize = require('../configs/db')
const { DataTypes, Sequelize } = require('sequelize')

const User = sequelize.define('users', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    first_name: { type: DataTypes.STRING, allowNull: false },
    last_name: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    photo: { type: DataTypes.STRING, defaultValue: 'default.jpg ' },
    email: { type: DataTypes.STRING, allowNull: false },
    role: {
        type: Sequelize.ENUM('admin', 'personal_trainer', 'nutritionist', 'consumer'),
        defaultValue: 'consumer',
    },
})

module.exports = User
