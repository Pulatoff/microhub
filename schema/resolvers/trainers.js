const Personal_trainer = require('../../models/personalTrainerModel')
const protected = require('../../utils/protect')
const User = require('../../models/userModel')
const Program = require('../../models/programModel')
module.exports = {
    Query: {
        async trainers(_, __, { req }) {
            const { id } = await protected({ req })
            const trainer = await Personal_trainer.findOne({
                where: { userId: id },
                include: { model: Program, as: 'programs' },
            })
            console.log(trainer)
            return trainer
        },
    },
    Mutation: {},
}
