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
    weight: String!
    height: String!
    favorite_foods: [String]!
    least_favorite_foods: [String]!
    allergies: [String]!
    user_id: ID!
    status: ID!
  }

  input createGoal {
    user_id: ID!
    protein: String!
    carbohydrates: String!
    fats: String!
    colories: String!
    start_date: String!
    end_date: String!
  }

  input createProgramm {
    course: Coure!
    food_id: ID!
    quantity_id: ID!
    serving_id: ID!
  }

  input createDairy {
    programm_id: ID!
    course: Coure!
    food_id: ID!
    quantity_id: ID!
    serving_id: ID!
  }

  input createVersion {
    category: String!
  }
  # only admin input category version

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

  # schema for consumer schema
  type Body_fat {
    lean_body_mass: Float!
    body_fat: Float!
    body_fat_pct: Float!
  }

  type Consumer {
    id: ID!
    body_fat: Body_fat!
    weight: Weight!
    height: Height!
    allergies: [String]!
    favorite_foods: [String]!
    least_favorite_foods: [String]!
    user: User!
    dairy: [Dairy]!
    goals: [Goals]!
    activity_level: Activity_level!
    status: Status!
  }

  # enum for consumer schema
  enum Activity_level {
    # "Sendentary: Little or No Exercise, Desk Job"  === 1.2
    sendentary

    # "Lightly Active: Light exercise, Sports 1-3 days/week"  === 1.375
    lightly_active

    # "Moderate Active: Moderate exercise, Sports 3-5 days/week" === 1.55
    modarate_active

    # "Very Active: Heavy Exercise, Sports 6-7 days/week" === 1.725
    very_active

    # "Extremely Active: Exercise, Sports several times per day" === 1.9
    extrmely_active
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
    food_id: ID!
    quantity_id: Int!
    serving_id: Int!
    course: Coure!
    programm: Programm!
  }

  type Programm {
    food_id: ID!
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
