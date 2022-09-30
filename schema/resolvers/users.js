const User = require('../../models/userModel')
const { ApolloError } = require('apollo-server-errors')
const bcrypt = require('bcryptjs')
const createJwt = require('../../utils/createJWT')
const checkUser = require('../../utils/protect')

module.exports = {
    Query: {
        users: () => {
            return []
        },
        checkMe: async (_, __, { req }) => {
            try {
                const { id } = await checkUser({ req })
                const user = await User.findByPk(id)
                if (user) throw new Error('this user not found, please register')
                return user
            } catch (error) {
                return new ApolloError(error.message)
            }
        },
    },

    Mutation: {
        register: async (
            _,
            { register: { first_name, last_name, email, password, passwordConfirm, phone, photo, role } },
            { req, res }
        ) => {
            try {
                // checking password
                if (password !== passwordConfirm) throw new Error('passwords not the same, please try again')

                const user = await User.create({ first_name, last_name, email, photo, phone, password, role })

                // creating jwt
                const accessToken = createJwt(user.id)
                const newUser = Object.assign(user, { accessToken })
                return newUser
            } catch (error) {
                return new ApolloError(error.message)
            }
        },
        login: async (_, { login: { email, password } }) => {
            try {
                // checking exist user
                const oldUser = await User.findOne({ where: { email } })
                if (!oldUser) throw new Error("User don't exist")

                // checking password
                const compare = await bcrypt.compare(password, oldUser.password)
                if (!compare) throw new Error('Entering wrong password')

                // creating jwt
                const accessToken = createJwt(oldUser.id)
                const user = Object.assign(oldUser, { accessToken })
                return user
            } catch (error) {
                return new ApolloError(error.message)
            }
        },
        updateMe: async (_, { updateMe }, { req }) => {
            try {
                const { id } = await checkUser({ req })
                const updatedUser = await User.update(updateMe, { where: { id }, returning: true, plain: true })
                return updatedUser[1].dataValues
            } catch (error) {
                return new ApolloError(error.message)
            }
        },
    },
}
