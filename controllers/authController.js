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
const response = require('../utils/response')

exports.signupCLient = CatchError(async (req, res, next) => {
    const { first_name, last_name, email, password, passwordConfirm } = req.body
    if (!first_name || !last_name || !email || !password || !passwordConfirm)
        next(new AppError('You need to enter all required fields', 401))

    if (password !== passwordConfirm) next(new AppError('password not the same', 401))

    const user = await User.create({ first_name, last_name, email, password, role: 'consumer' })

    const token = await createJwt(user.id)
    saveCookie(token, res)
    response(
        201,
        'You are successfully authorizated',
        true,
        {
            user: {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                photo: user.photo,
                createdAt: user.createdAt,
            },
        },
        res
    )
})

exports.signin = CatchError(async (req, res, next) => {
    const { password, email } = req.body
    if (!password || !email) next(new AppError('Email or Password could not be empty', 404))
    const user = await User.findOne({ where: { email, isActive: 1 }, include: [{ model: Consumer }] })
    if (!user) next(new AppError('Wrong password or email, Please try again', 404))
    // comparing passwords
    const compare = await bcrypt.compare(password, user.password)
    if (!compare) next(new AppError('Wrong password or email, Please try again', 401))

    const token = createJwt(user.id)
    saveCookie(token, res)
    response(201, 'You are successfully logged in', true, { user }, res)
})

exports.logout = CatchError(async (req, res, next) => {
    saveCookie('loggedOut', res)
    response(206, 'You are successfuly logout', true, '', res)
})

exports.protect = CatchError(async (req, res, next) => {
    let token
    if (req.cookies.jwt) {
        token = req.cookies.jwt
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.slice(7)
    } else {
        next(new AppError('you are not authorized', 401))
    }

    if (!token) next(new AppError('You are not authorized', 401))
    const tekshir = jwt.verify(token, process.env.JWT_SECRET_KEY)
    if (!tekshir) next(new AppError('Your token expired', 401))
    const user = await User.findByPk(tekshir.id)
    if (!user) next(new AppError('This user not exist', 401))
    req.user = user
    next()
})

exports.usersSelf = CatchError(async (req, res, next) => {
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

    response(200, 'user data', true, { user }, res)
})

exports.role = (roles) => {
    return async (req, res, next) => {
        try {
            // 1) User ni roleni olamiz databasedan, tekshiramiz
            if (!roles.includes(req.user.role)) {
                return next(new AppError("You don't access this process", 405))
            }
            next()
        } catch (error) {
            next(new AppError(error.message, 404))
        }
    }
}

exports.signupNutritionist = CatchError(async (req, res, next) => {
    const { first_name, last_name, email, password, passwordConfirm } = req.body

    if (!first_name || !last_name || !email || !password || !passwordConfirm)
        next(new AppError('You need to enter all required fields', 404))

    // checking the saming => password and passwordConfirm
    if (password !== passwordConfirm) throw new Error('password not the same')
    // checking user existing
    const oldUser = await User.findOne({ where: { email } })
    if (oldUser?.role === 'consumer') next(new AppError('This method is not allowed to you', 405))
    const user = await User.create({ first_name, last_name, email, password, role: 'nutritionist' })
    const nutrisionist = await Personal_Trainer.create({ userId: user.id })
    const token = await createJwt(user.id)

    // transformation to new object
    const trainer = {
        id: nutrisionist.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        photo: 'default.jpg',
        linkToken: nutrisionist.linkToken,
        credentials: {},
    }
    // sending cookies
    saveCookie(token, res)
    response(
        201,
        'You are successfully authorizated',
        true,
        {
            nutritionist: trainer,
        },
        res
    )
})
