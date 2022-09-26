const { ApolloError } = require('apollo-server-errors')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const checkUser = async ({ req }) => {
    try {
        let token

        // check having token
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]
        } else throw new Error('You are not authtorizated')

        // check valid token
        const accessToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
        if (!accessToken) throw new Error('Expired token, please login ')

        return accessToken
    } catch (error) {
        return new ApolloError(error.message)
    }
}

module.exports = checkUser
