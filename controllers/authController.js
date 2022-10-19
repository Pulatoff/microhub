const User = require('../models/userModel')
const createJwt = require('../utils/createJWT')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const AppError = require('../utils/AppError')
const Personal_Trainer = require('../models/personalTrainerModel')

exports.signupCLient = async (req, res, next) => {
    try {
        const { first_name, last_name, email, password, passwordConfirm } = req.body
        // checking the saming => password and passwordConfirm
        if (password !== passwordConfirm) throw new Error('password not the same')
        // checking user existing
        const user = await User.create({ first_name, last_name, email, password, role: 'consumer' })
        const token = await createJwt(user.id)
        res.status(200).json({
            status: 'success',
            data: {
                accessToken: `Bearer ${token}`,
                user: {
                    id: user.id,
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    photo: user.photo,
                },
            },
        })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

exports.signin = async (req, res, next) => {
    try {
        const { password, email } = req.body
        if (!password || !email) throw new Error('field could not be pustim')
        const user = await User.findOne({ where: { email, isActive: 1 } })
        if (!user) throw new Error('Wrong password or email, Please try again')
        // comparing passwords
        const compare = await bcrypt.compare(password, user.password)
        if (!compare) throw new Error('Wrong password or email, Please try again')
        const token = createJwt(user.id)
        res.status(200).json({
            status: 'succes',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    photo: user.photo,
                },
                accessToken: `Bearer ${token}`,
            },
        })
    } catch (error) {
        next(new AppError(error.message, 404))
    }
}

exports.logout = async (req, res, next) => {
    try {
        const id = req.user.id
        const user = await User.findByPk(id)
        user.isActive = 0
        user.save()
        res.status(200).json({ status: 'success', data: '' })
    } catch (error) {
        next(new AppError(error.message, 404))
    }
}

exports.protect = async (req, res, next) => {
    try {
        let token
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.slice(7)
            console.log(token)
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
        next(new AppError(error.message))
    }
}

exports.role = (roles) => {
    return async (req, res, next) => {
        try {
            // 1) User ni roleni olamiz databasedan, tekshiramiz
            if (!roles.includes(req.user.role)) {
                return next(new AppError("You don't access this process", 401))
            }
            next()
        } catch (error) {
            next(new AppError(error.message, 404))
        }
    }
}

exports.signupNutritionist = async (req, res, next) => {
    try {
        const { first_name, last_name, email, password, passwordConfirm } = req.body
        // checking the saming => password and passwordConfirm
        if (password !== passwordConfirm) throw new Error('password not the same')
        // checking user existing
        const user = await User.create({ first_name, last_name, email, password, role: 'nutritionist' })
        const nutrisionist = await Personal_Trainer.create({ userId: user.id })
        const token = await createJwt(user.id)
        const trainer = {
            id: nutrisionist.id,
            userId: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            credentials: {},
        }
        res.status(200).json({
            status: 'success',
            data: {
                accessToken: `Bearer ${token}`,
                trainer,
            },
        })
    } catch (error) {
        next(new AppError(error.message, 404))
    }
}
