const Group = require('../models/groupModel')
const GroupConsumer = require('../models/groupConsumerModel')
const AppError = require('../utils/AppError')
const Trainer = require('../models/personalTrainerModel')

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
