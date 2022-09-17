const { gql } = require("apollo-server");

const typeDefs = gql`
  type Query {
    users: [User!]!
  }

  # input Register {
  #   name: String!
  #   password: String!
  #   passwordConfirm: String!
  #   photo: String
  #   email: String!
  #   phone: String!
  #   role: String!
  # }

  # input Login {
  #   login: String!
  #   password: String!
  # }

  # input CreateConsumer {
  #   weight: String!
  #   height: String!
  #   favorite_foods: [String]!
  #   least_favorite_foods: [String]!
  #   allergies: [String]!
  #   user_id: ID!
  #   status: ID!
  # }

  # input createGoal {
  #   user_id: ID!
  #   protein: String!
  #   carbohydrates: String!
  #   fats: String!
  #   calories: String!
  #   start_date: String!
  #   end_date: String!
  # }

  # input createprogram {
  #   course: Course!
  #   food_id: ID!
  #   quantity_id: ID!
  #   serving_id: ID!
  # }

  # input createDairy {
  #   program_id: ID!
  #   course: Course!
  #   food_id: ID!
  #   quantity_id: ID!
  #   serving_id: ID!
  # }

  # input createVersion {
  #   category: String!
  #   # only admin input category version
  # }

  # user schema main info
  type User {
    id: ID!
    login: String!
    first_name: String!
    last_name: String!
    password: String!
    photo: String!
    email: String!
    role: Role!
    phone: String!
    gender: Gender!
  }

  # enum for user schema gender field
  enum Gender {
    male
    female
  }

  # enum to user schema field role
  enum Role {
    Admin
    Personal_trainer
    Nutritionist
    Consumer
  }

  # schema for consumer schema
  type Body_fat {
    lean_body_mass: Float!
    body_fat: Float!
    body_fat_pct: Float!
  }

  # consumer daily targets based on weight and tdee
  type Daily_targets {
    daily_calorie: Int!
    daily_protein: Int!
    daily_fat: Int!
    daily_carbs: Int!
  }

  enum Body_frame {
    small
    medium
    large
  }

  type Consumer {
    id: ID!
    body_fat: Body_fat!
    weight: Float!
    height: Float!
    allergies: [String]!
    favorite_foods: [String]!
    least_favorite_foods: [String]!
    user: User!
    dairy: [Dairy]!
    goals: [Goals]!
    activity_level: Activity_level!
    status: Status!
    bmi: Float!
    tdee: Int!
    daily_targets: Daily_targets!
    # body frame only enum fields
    body_frame: Body_frame!
    calories_burnt: Int!
    healthy_weight: Float!
    types_of_preferences: preferences!
  }

  # food preferences consumers
  enum preferences {
    diet
    standard
    vegetarian
    lacto_vegetarian
    ovo_vegetarian
    vegan
    gluten_free
    halal
    kosher
    meat
    pescetarian
    pollotarian
  }
  # enum for consumer schema
  enum Activity_level {
    # "Sendentary: Little or No Exercise, Desk Job"  === 1.2
    sendentary

    # "Lightly Active: Light exercise, Sports 1-3 days/week"  === 1.375
    lightly_active

    # "Moderate Active: Moderate exercise, Sports 3-5 days/week" === 1.55
    moderate_active

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
    calories: String!
    start_date: String!
    end_date: String!
  }

  type Dairy {
    food_id: ID!
    quantity_id: Int!
    serving_id: Int!
    course: Course!
    program: program!
    createdAt: String!
  }

  type program {
    food_id: ID!
    quantity_id: Int!
    serving_id: Int!
    course: Course!
    createdAt: String!
  }

  # enum for programs schema course field
  enum Course {
    Breakfast
    Brunch
    Lunch
    Snacks
    Dinner
  }

  type Personal_Trainer {
    user: User!
    programs: [program]!
    status: Boolean!
    consumer: [Consumer]!
    link: String!
  }
`;

module.exports = { typeDefs };
