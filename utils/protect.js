const { ApolloError } = require('apollo-server-errors')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const authtorizated = async (req) => {
    try {
        let token

        // check having token
        if (req.headers.authorization && req.headers.authorization.startWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]
        } else throw new Error('You are not authtorizated')

        // check valid token
        const accessToken = jwt.verify(token, process.env.JWT_SECRET_KEY)

        // finding user
        const user = await User.findByPk(accessToken.id)
        if (!user) throw new Error('This your is not exist')
        return user
    } catch (error) {
        return new ApolloError(error.message)
    }
}

module.exports = authtorizated
