const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// models
const User = require('../models/userModel')
const Consumer = require('../models/consumerModel')
const Personal_Trainer = require('../models/personalTrainerModel')
// utils
const AppError = require('../utils/AppError')
const CatchError = require('../utils/catchErrorAsyncFunc')
const saveCookie = require('../utils/sendCookieJWT')
const createJwt = require('../utils/createJWT')

exports.signupCLient = CatchError(async (req, res) => {
    const { first_name, last_name, email, password, passwordConfirm } = req.body
    // checking the saming => password and passwordConfirm
    if (password !== passwordConfirm) throw new Error('password not the same')
    // checking user existing
    const user = await User.create({ first_name, last_name, email, password, role: 'consumer' })
    const token = await createJwt(user.id)
    saveCookie(token, res)
    res.status(200).json({
        status: 'success',
        data: {
            user: {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                photo: user.photo,
                createdAt: user.createdAt,
            },
        },
    })
})

exports.signin = CatchError(async (req, res) => {
    const { password, email } = req.body
    if (!password || !email) throw new Error('field could not be pustim')
    const user = await User.findOne({ where: { email, isActive: 1 } })
    if (!user) throw new Error('Wrong password or email, Please try again')
    // comparing passwords
    const compare = await bcrypt.compare(password, user.password)
    if (!compare) throw new Error('Wrong password or email, Please try again')
    const token = createJwt(user.id)
    saveCookie(token, res)
    res.status(200).json({
        status: 'succes',
        data: {
            user: {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                photo: user.photo,
                createdAt: user.createdAt,
            },
        },
    })
})

exports.logout = CatchError(async (req, res) => {
    const id = req.user.id
    const user = await User.findByPk(id)
    user.isActive = 0
    user.save()
    res.status(200).json({ status: 'success', data: '' })
})

exports.protect = CatchError(async (req, res, next) => {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.slice(7)
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt
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
})

exports.usersSelf = CatchError(async (req, res) => {
    let user
    if (req.user.role === 'consumer') {
        user = await User.findByPk(req.user.id, {
            include: [{ model: Consumer }],
            attributes: ['id', 'first_name', 'last_name', 'email', 'photo', 'createdAt'],
        })
    } else if (req.user.role === 'nutritionist') {
        user = await User.findByPk(req.user.id, {
            include: [{ model: Personal_Trainer }],
            attributes: ['id', 'first_name', 'last_name', 'email', 'photo', 'createdAt'],
        })
    }

    res.status(200).json({ data: { user }, status: 'success' })
})

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

exports.signupNutritionist = CatchError(async (req, res) => {
    const { first_name, last_name, email, password, passwordConfirm } = req.body
    // checking the saming => password and passwordConfirm
    if (password !== passwordConfirm) throw new Error('password not the same')
    // checking user existing
    const user = await User.create({ first_name, last_name, email, password, role: 'nutritionist' })
    const nutrisionist = await Personal_Trainer.create({ userId: user.id })
    const token = await createJwt(user.id)
    const trainer = {
        id: nutrisionist.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        photo: 'default.jpg',
        linkToken: nutrisionist.linkToken,
        credentials: {},
    }
    saveCookie(token, res)
    res.status(200).json({
        status: 'success',
        data: {
            nutritionist: trainer,
        },
    })
})
