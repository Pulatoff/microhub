const User = require('../../models/userModel')
const { ApolloError } = require('apollo-server-errors')
const bcrypt = require('bcryptjs')
const createJwt = require('../../utils/createJWT')
const protect = require('../../utils/protect')

module.exports = {
    Query: {
        users: () => {
            return []
        },
    },

    Mutation: {
        register: async (
            _,
            { register: { first_name, last_name, email, password, passwordConfirm, phone, photo, role } },
            { req, res }
        ) => {
            try {
                // checking email
                if (!email) throw new Error("Email don't exist")
                const existUser = await User.findOne({ where: { email } })
                if (existUser) throw new Error('this email user exists,Please login')

                // checking password
                if (password !== passwordConfirm) throw new Error('passwords not the same, please try again')
                const hash = await bcrypt.hash(password, 16)

                const user = await User.create({ first_name, last_name, email, photo, phone, password: hash, role })

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
        updateMe: async (_, { updateMe }) => {
            try {
            } catch (error) {
                return new ApolloError(error.message)
            }
        },
        // checkMe: async (_, {}, { req }) => {
        //     try {
        //         let accessToken
        //         if (req.headers.authorization && req.headers.authorization.startWith('Bearer'))
        //             accessToken = req.headers.authorization.split(' ')[1]
        //     } catch (error) {
        //         return new ApolloError('')
        //     }
        // },
    },
}
