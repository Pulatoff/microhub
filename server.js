require('dotenv').config({})
const { ApolloServer } = require('apollo-server')
const resolvers = require('./schema/resolvers')
const { typeDefs } = require('./schema/typeDefs')
const sequlize = require('./configs/db')

const PORT = process.env.PORT || 8000

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

<<<<<<< HEAD
server.listen({port:80}).then(({ url }) => {
    console.log(`Server running in: ${url}`)
})
=======
const serverStart = async () => {
    const start = await server.listen({ port: PORT })
    if (process.env.NODE_ENV === 'development') console.log(start.url)
}

serverStart()
>>>>>>> 3c75c3480f351e58d7d38748f42cab88d54e7b16
