const { ApolloServer } = require("apollo-server");
const { isConstValueNode } = require("graphql");
const { resolvers } = require("./schema/resolvers");
const { typeDefs } = require("./schema/typeDefs");

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server running in: ${url}`);
});
