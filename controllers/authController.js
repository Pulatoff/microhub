const User = require('../models/userModel')
const createJwt = require('../utils/createJWT')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const AppError = require('../utils/AppError')

exports.signup = async (req, res, next) => {
    try {
        const { first_name, last_name, email, password, passwordConfirm } = req.body
        // checking the saming => password and passwordConfirm
        if (password !== passwordConfirm) throw new Error('password not the same')
        // checking user existing
        const user = await User.create({ first_name, last_name, email, password })
        const token = await createJwt(user.id)
        res.status(200).json({
            status: 'success',
            data: {
                accessToken: `Bearer ${token}`,
                user,
            },
        })
    } catch (error) {
        console.log(error)
        res.status(404).json({ message: error.message })
    }
}
exports.signin = async (req, res, next) => {
    try {
        const { password, email } = req.body
        if (!password || !email) throw new Error('field could not be pustim')
        const user = await User.findOne({ where: { email } })
        if (!user) throw new Error('Wrong password or email, Please try again')
        // comparing passwords
        const compare = await bcrypt.compare(password, user.password)
        if (!compare) throw new Error('Wrong password or email, Please try again')
        const token = createJwt(user.id)
        res.status(200).json({ status: 'succes', data: { user, accessToken: `Bearer ${token}` } })
    } catch (error) {
        console.log(error.message)
        res.status(404).json({
            status: 'failed',
            message: error.message,
        })
    }
}

exports.protect = async (req, res, next) => {
    try {
        let token
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]
        } else {
            throw new Error('you are not authorizated')
        }
        if (!token) throw new Error('You not authorized')

        const tekshir = jwt.verify(token, process.env.JWT_SECRET_KEY)
        if (!tekshir) throw new Error('Your token expired')

        const user = await User.findByPk(tekshir.id)
        if (!user) throw new Error('This user not exist')
        req.user = user
        next()
    } catch (error) {
        console.log(error.message)
        res.status(404).json({
            status: 'failed',
            message: error.message,
        })
    }
}

exports.role = (roles) => {
    return async (req, res, next) => {
        // 1) User ni roleni olamiz databasedan, tekshiramiz
        if (!roles.includes(req.user.role)) {
            return next(new AppError("You don't access this process", 401))
        }
        next()
    }
}
