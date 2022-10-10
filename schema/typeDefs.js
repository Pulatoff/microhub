const { gql } = require('apollo-server')

const typeDefs = gql`
    type Query {
        users: [User!]!
        consumer: Consumer!
        programs: program!
        trainers: Personal_Trainer
    }

    type Mutation {
        login(login: Login): User!
        register(register: Register): User!
        createConsumer(createConsumer: CreateConsumer): Consumer!
        createProgram(createProgram: CreateProgram): program!
    }

    input UpdateMe {
        first_name: String
        last_name: String
        photo: String
        email: String
        phone: String
    }

    input Register {
        first_name: String!
        last_name: String!
        password: String!
        passwordConfirm: String!
        email: String!
        role: String!
    }

    input Login {
        email: String!
        password: String!
    }

    input CreateConsumer {
        weight: Float!
        height: Float!
        favorite_foods: [String]
        least_favorite_foods: [String]
        allergies: [String]
        preferences: String
        gender: Gender!
    }

    # input createGoal {
    #   user_id: ID!
    #   protein: String!
    #   carbohydrates: String!
    #   fats: String!
    #   calories: String!
    #   start_date: String!
    #   end_date: String!
    # }

    input CreateProgram {
        course: Course!
        food_id: ID!
        quantity: Int!
        serving: String!
    }

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
        id: Int!
        first_name: String!
        last_name: String!
        password: String!
        photo: String!
        email: String!
        role: Role
        phone: String
        gender: Gender
        accessToken: String
        createdAt: String
    }

    # enum for user schema gender field
    enum Gender {
        male
        female
    }

    # enum to user schema field role
    enum Role {
        admin
        personal_trainer
        nutritionist
        consumer
    }

    # schema for consumer schema
    type Body_fat {
        LEAN_BODY_MASS: Float!
        BODY_FAT: Float!
        BODY_FAT_PCT: Float!
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
        body_fat: Body_fat
        weight: Float!
        height: Float!
        allergies: [String]
        favorite_foods: [String]
        least_favorite_foods: [String]
        user: User
        dairy: [Dairy]
        goals: [Goals]
        activity_level: Activity_level
        bmi: Float
        tdee: Int
        daily_targets: Daily_targets
        # body frame only enum fields
        body_frame: Body_frame
        calories_burnt: Int
        healthy_weight: Float
        types_of_preferences: preferences!
        createdAt: String
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
        createdAt: String!
    }

    type Version {
        id: ID!
        category: Category!
        createdAt: String!
    }

    enum Category {
        free
        premium
    }

    type Goals {
        id: ID!
        carbohydrates: String!
        protein: String!
        fats: String!
        calories: String!
        consumer: Consumer!
        start_date: String!
        end_date: String!
        createdAt: String!
    }

    type Dairy {
        id: ID!
        food_id: String!
        quantity_id: String!
        serving_id: String!
        course: Course!
        program: program!
        user: Consumer!
        createdAt: String!
    }

    type program {
        id: ID!
        food_id: ID
        quantity: Int!
        serving: String!
        nutritionist: Personal_Trainer
        course: Course!
        createdAt: String
    }

    # enum for programs schema course field
    enum Course {
        breakfast
        brunch
        lunch
        snacks
        dinner
    }

    type Personal_Trainer {
        id: ID!
        user: User!
        programs: [program]!
        consumer: [Consumer]!
        link: String
        createdAt: String!
    }

    type Personal_Trainer {
        id: ID!
        user: User!
        programs: [program]!
        consumer: [Consumer]!
        link: String
        createdAt: String!
    }
`

module.exports = { typeDefs }
