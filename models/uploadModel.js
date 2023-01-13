const sequelize = require('../configs/db')
const { DataTypes } = require('sequelize')

const Upload = sequelize.define('trainer_uploads', {
    id: { type: DataTypes.INTEGER },
    name: { type: DataTypes.STRING, allowNull: false },
})
