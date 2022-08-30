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

  enum WeightMeasure {
    kg
    lb
  }
  type Weight {
    measure: WeightMeasure!
    weight: Int!
  }

  enum HeightMeasure {
    cm
    inch
  }

  type Height {
    height: Int!
    measure: HeightMeasure!
  }

  type Consumer {
    id: ID!
    weight: Weight!
    height: Height!
    favorite_foods: [String!]!
    least_favorite_foods: [String!]!
    user: User!
    dairy: [Dairy]!
    goals: [Goals]!
    status: Status!
  }

  type Status {
    id: ID!
    expires_date: String!
    version: Version!
  }

  type Version {
    id: ID!
    category: Category!
  }

  enum Category {
    Free
    Premium
  }

  type Goals {
    id: ID!
    carbohydrates: String!
    protein: String!
    fats: String!
    colories: String!
    start_date: String!
    end_date: String!
  }

  type Dairy {
    quantity_id: Int!
    serving_id: Int!
    course: Coure!
    programm: Programm!
  }

  type Programm {
    quantity_id: Int!
    serving_id: Int!
    course: Coure!
  }

  enum Coure {
    Breakfast
    Brunch
    Lunch
    Snacks
    Dinner
  }

  type Personal_Trainer {
    user: User!
    programms: [Programm]!
    status: Boolean!
    consumer: [Consumer]!
    link: String!
  }

  type Query {
    users: [User!]!
  }
`;

module.exports = { typeDefs };
