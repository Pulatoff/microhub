const { gql } = require("apollo-server");

const typeDefs = gql`
  type User {
    id: ID!
    login: String!
    name: String!
    password: String!
    photo: String!
    email: String!
    role: Role
    phone: String!
  }

  enum Role {
    Admin
    Personal
    Trainer
    Consumer
  }

  type Query {
    users: [User!]!
  }
`;

module.exports = { typeDefs };
