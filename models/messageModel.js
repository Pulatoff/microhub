const sequelize = require('../configs/db')
const { DataTypes } = require('sequelize')
const Consumer = require('./consumerModel')
const Trainer = require('./personalTrainerModel')

const Message = sequelize.define('messages', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    message: { type: DataTypes.TEXT },
    room_number: { type: DataTypes.STRING },
    send_side: { type: DataTypes.STRING },
    send_date: { type: DataTypes.DATE },
})

Consumer.hasMany(Message)
Message.belongsTo(Consumer)

Trainer.hasMany(Message)
Message.belongsTo(Trainer)

module.exports = Message
