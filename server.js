require('dotenv').config({})
const { ApolloServer } = require('apollo-server')
const resolvers = require('./schema/resolvers')
const { typeDefs } = require('./schema/typeDefs')
const sequlize = require('./configs/db')
const server = new ApolloServer({
    typeDefs,
    resolvers,
})

sequlize.sync()

server.listen().then(({ url }) => {
    console.log(`Server running in: ${url}`)
})
