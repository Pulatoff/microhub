const { gql } = require("apollo-server");

const typeDefs = gql`
  type Query {
    users: [User!]!
  }

  input Register {
    name: String!
    password: String!
    passwordConfirm: String!
    photo: String
    email: String!
    phone: String!
    role: String!
  }

  input Login {
    login: String!
    password: String!
  }

  input CreateConsumer {
    favorite_foods: [String]!
    least_favorite_foods: [String]!
    allergies: [String]!
    user_id: ID!
    status: ID!
  }

  input Goals {
    user_id: ID!
    protein: String!
    carbohydrates: String!
    fats: String!
    colories: String!
    start_date: String!
    end_date: String!
  }

  input Programm {
    course: Coure!
    user_id: ID!
    food_id: ID!
    quantity_id: ID!
    serving_id: ID!
  }

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
    allergies: [String]!
    favorite_foods: [String]!
    least_favorite_foods: [String]!
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
`;

module.exports = { typeDefs };
