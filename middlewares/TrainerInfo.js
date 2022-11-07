const Trainer = require('../models/personalTrainerModel')
//utils
const CatchError = require('../utils/catchErrorAsyncFunc')
const AppError = require('../utils/AppError')

module.exports = CatchError(async (req, res, next) => {
    const userId = req.user.id
    const nutritionist = await Trainer.findOne({ where: { userId } })
    if (!nutritionist) next(new AppError('Nutritionist is not exist', 404))
    req.nutritionist = nutritionist
    next()
})
