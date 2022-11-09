const Group = require('../models/groupModel')
const GroupConsumer = require('../models/groupConsumerModel')
const AppError = require('../utils/AppError')
const Trainer = require('../models/personalTrainerModel')
const ConsumerTrainer = require('../models/consumerTrainer')
const Consumer = require('../models/consumerModel')
const User = require('../models/userModel')
const CatchError = require('../utils/catchErrorAsyncFunc')

exports.addGroup = CatchError(async (req, res, next) => {
    const userId = req.user.id
    const trainer = await Trainer.findOne({ where: { userId } })
    const { name } = req.body
    if (!name) next(new AppError('Name is not be empty'))
    const group = await Group.create({ name, nutritionistId: trainer.id })
    res.status(200).json({
        status: 'success',
        data: { group: { id: group.id, name: group.name } },
    })
})

exports.bindGroup = CatchError(async (req, res, next) => {
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
})

exports.getAllGroups = CatchError(async (req, res) => {
    const userId = req.user.id
    const trainer = await Trainer.findOne({ where: { userId } })
    const groups = await Group.findAll({
        where: { nutritionistId: trainer.id },
        attributes: ['id', 'name', 'created'],
        include: [
            {
                model: Consumer,
                include: [
                    { model: User, attributes: ['id', 'first_name', 'last_name', 'email', 'photo', 'createdAt'] },
                ],
            },
        ],
    })
    res.status(200).json({
        status: 'success',
        data: { groups },
    })
})

exports.getOneGroup = CatchError(async (req, res, next) => {
    const { id } = req.params
    const userId = req.user.id
    const trainer = await Trainer.findOne({ where: { userId } })
    if (!trainer) next(new AppError('This trainer  does not exist'))
    const group = await Group.findByPk(id, {
        where: { nutritionistId: trainer.id },
        include: [
            {
                model: Consumer,
                include: [
                    { model: User, attributes: ['id', 'first_name', 'last_name', 'email', 'photo', 'createdAt'] },
                ],
            },
        ],
    })
    res.status(200).json({
        status: 'success',
        data: { group },
    })
})

exports.updateGroup = CatchError(async (req, res, next) => {
    const { name } = req.body
    const { id } = req.params
    const userId = req.user.id
    const trainer = await Trainer.findOne({ where: { userId } })
    const group = await Group.findByPk(id, {
        where: { nutritionistId: trainer.id },
        attributes: ['id', 'name', 'createdAt'],
    })
    if (!group) next(new AppError('This group does not exist', 404))
    group.name = name || group.name
    await group.save()
    res.status(200).json({ status: 'success', data: { group } })
})
