require('dotenv').config({})
const { ApolloServer } = require('apollo-server')
const resolvers = require('./schema/resolvers')
const { typeDefs } = require('./schema/typeDefs')
const sequlize = require('./configs/db')
const authtorizated = require('./utils/protect')

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => {
        const token = req.headers?.authorization?.split(' ')[1]

        return { req, res, token }
    },
    cors: {
        credentials: true,
    },
})

sequlize.sync()

server.listen({port:80}).then(({ url }) => {
    console.log(`Server running in: ${url}`)
})
