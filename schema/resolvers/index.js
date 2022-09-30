const userResolvers = require('./users')
const consumerResolvers = require('./consumers')
const programResolvers = require('./programs')
const trainerResolvers = require('./trainers')

const resolvers = {
    Query: {
        ...userResolvers.Query,
        ...consumerResolvers.Query,
        ...programResolvers.Query,
        ...trainerResolvers.Query,
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...consumerResolvers.Mutation,
        ...programResolvers.Mutation,
        ...trainerResolvers.Mutation,
    },
}

module.exports = resolvers
