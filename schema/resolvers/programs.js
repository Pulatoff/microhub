const { ApolloError } = require('apollo-server-errors')
const Program = require('../../models/programModel')
const checkRole = require('../../utils/checkRole')
const protected = require('../../utils/protect')

module.exports = {
    Query: {
        programs() {
            return {}
        },
    },
    Mutation: {
        async createProgram(_, { createProgram: { serving, quantity, food_id, course } }, { req }) {
            try {
                const { id } = await protected({ req })
                const { role } = await checkRole({ user_id: id })
                if (role === 'consumer' || role === 'personal_trainer') throw new Error("You can't create program")
                const program = await Program.create({ serving, quantity, food_id, course, nutrinionist_id: id })
                return program
            } catch (error) {
                return new ApolloError(error.message)
            }
        },
    },
}
