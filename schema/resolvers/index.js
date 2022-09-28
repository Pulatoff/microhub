const userResolvers = require('./users')
const consumerResolvers = require('./consumers')
const resolvers = {
    Query: {
        ...userResolvers.Query,
        ...consumerResolvers.Query,
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...consumerResolvers.Mutation,
    },
}

module.exports = resolvers
