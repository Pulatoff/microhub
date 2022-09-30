const userResolvers = require('./users')
const consumerResolvers = require('./consumers')
const programResolvers = require('./programs')

const resolvers = {
    Query: {
        ...userResolvers.Query,
        ...consumerResolvers.Query,
        ...programResolvers.Query,
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...consumerResolvers.Mutation,
        ...programResolvers.Mutation,
    },
}

module.exports = resolvers
