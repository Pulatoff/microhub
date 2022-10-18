const sequelize = require('../configs/db')
const Consumer = require('./consumerModel')
const Trainer = require('./personalTrainerModel')

const ConsumerTrainer = sequelize.define('consumer_trainers', {}, { timestamps: false })

Consumer.belongsToMany(Trainer, { through: ConsumerTrainer })
Trainer.belongsToMany(Consumer, { through: ConsumerTrainer })

module.exports = ConsumerTrainer
