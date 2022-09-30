const { ApolloError } = require('apollo-server-errors')
const Consumer = require('../../models/consumerModel')
const User = require('../../models/userModel')
const protected = require('../../utils/protect')

module.exports = {
    Query: {
        consumer: async (_, __, { req }) => {
            try {
                const { id } = await protected({ req })
                const consumer = await Consumer.findOne({
                    where: { userIdId: id },
                    include: [{ model: User, as: 'user_id' }],
                })
                consumer.user = consumer.user_id.dataValues
                return consumer
            } catch (error) {
                return new ApolloError(error.message)
            }
        },
    },
    Mutation: {
        createConsumer: async (
            _,
            {
                createConsumer: {
                    weight,
                    height,
                    least_favorite_foods,
                    favorite_foods,
                    preferences,
                    allergies,
                    gender,
                },
            },
            { req }
        ) => {
            const { id } = await protected({ req })
            const consumer = await Consumer.create({
                weight,
                height,
                least_favorite_foods,
                favorite_foods,
                allergies,
                gender,
                preferences,
                userIdId: id,
            })

            return consumer
        },
    },
}
