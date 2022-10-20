const Group = require('../models/groupModel')
const GroupConsumer = require('../models/groupConsumerModel')
const AppError = require('../utils/AppError')
const Trainer = require('../models/personalTrainerModel')
const ConsumerTrainer = require('../models/consumerTrainer')
const Consumer = require('../models/consumerModel')
const User = require('../models/userModel')

exports.addGroup = async (req, res, next) => {
    try {
        const userId = req.user.id
        const trainer = await Trainer.findOne({ where: { userId } })
        const { name } = req.body
        const group = await Group.create({ name, nutritionistId: trainer.id })
        res.status(200).json({
            status: 'success',
            data: { group: { id: group.id, name: group.name } },
        })
    } catch (error) {
        next(new AppError(error.message, 404))
    }
}

exports.bindGroup = async (req, res, next) => {
    try {
        const userId = req.user.id
        const trainer = await Trainer.findOne({ where: { userId } })

        const { consumerId, groupId } = req.body
        const group = await Group.findByPk(groupId, { where: { nutritionistId: trainer.id } })
        if (!group) next(new AppError('this group not found', 404))
        const consumer = await ConsumerTrainer.findOne({ where: { nutritionistId: trainer.id, consumerId } })
        if (!consumer) next(new AppError('This consumer binding to you', 404))
        await GroupConsumer.create({ groupId, consumerId })
        res.status(200).json({
            status: 'success',
            data: '',
        })
    } catch (error) {
        next(new AppError(error.message, 404))
    }
}

exports.getAllGroups = async (req, res, next) => {
    try {
        const userId = req.user.id
        const trainer = await Trainer.findOne({ where: { userId } })
        const groups = await Group.findAll({
            where: { nutritionistId: trainer.id },
            include: [
                {
                    model: Consumer,
                    include: [{ model: User, attributes: ['id', 'first_name', 'last_name', 'email', 'photo'] }],
                },
            ],
        })
        res.status(200).json({
            status: 'success',
            data: { groups },
        })
    } catch (error) {
        next(new AppError(error.message, 404))
    }
}
