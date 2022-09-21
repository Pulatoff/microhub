const userResolvers = require('./users')

const resolvers = {
    Query: {
        ...userResolvers.Query,
    },
    Mutation: {
        ...userResolvers.Mutation,
    },
}

module.exports = resolvers
