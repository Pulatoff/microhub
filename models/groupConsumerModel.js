const sequelize = require('../configs/db')
const Group = require('./groupModel')
const Consumer = require('./consumerModel')

const GroupConsumer = sequelize.define('group_consumers', {}, { timestamps: false })

Group.belongsToMany(Consumer, { through: GroupConsumer })
Consumer.belongsToMany(Group, { through: GroupConsumer })

module.exports = GroupConsumer
