const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
// models
const User = require('../models/userModel')
const Consumer = require('../models/consumerModel')
const Personal_Trainer = require('../models/personalTrainerModel')
const Program = require('../models/programModel')
const Food = require('../models/mealModel')
const Meal = require('../models/programTimeModel')
const Swap = require('../models/swaperModel')
const Ingredient = require('../models/ingredientModel')
const Recipe = require('../models/recipeModel')
const ConsumerDetails = require('../models/consumerDetailsModel')
const SendMessageToMail = require('../utils/sendGrid')
// utils
const AppError = require('../utils/AppError')
const CatchError = require('../utils/catchErrorAsyncFunc')
const saveCookie = require('../utils/sendCookieJWT')
const createJwt = require('../utils/createJWT')
const response = require('../utils/response')
const ConsumerTrainer = require('../models/consumerTrainerModel')

function UserType(user) {
    const program_number = user?.consumer?.programs?.findIndex((val) => val.id === user.consumer.program_id)

    return {
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        email: user.email,
        photo: user.photo,
        consumer: user.consumer ? ConsumerType(user.consumer) : undefined,
        program:
            user?.consumer?.programs[program_number] && program_number !== -1
                ? ProgramType(user?.consumer?.programs[program_number])
                : undefined,
        createdAt: user.createdAt,
    }
}

function ProgramType(program) {
    return {
        id: program.id,
        name: program.name,
        preference: program.preference,
        cals: program.cals,
        protein: program.protein,
        carbs: program.carbs,
        fat: program.fat,
        weeks: program.weeks,
        total_recipes: program.total_recipes,
        meals: program.meals,
    }
}

function ConsumerType(consumer) {
    return {
        id: consumer.id,
        weight: consumer.weight,
        height: consumer.height,
        wrist: consumer.wrist,
        forearm: consumer.forearm,
        hip: consumer.hip,
        gender: consumer.gender,
        activity_level: consumer.activity_level,
        preferences: consumer.preferences,
        least_favorite_foods: consumer.least_favorite_foods,
        favorite_foods: consumer.favorite_foods,
        allergies: consumer.allergies,
        body_fat: consumer.body_fat,
        tdee: consumer.tdee,
        body_frame: consumer.body_frame,
        healthy_weight: consumer.healthy_weight,
        bmi: consumer.bmi,
        daily_targets: consumer.daily_targets,
        consumer_details: consumer?.consumer_details,
        program_id: consumer.program_id,
    }
}

exports.signupCLient = CatchError(async (req, res, next) => {
    const { first_name, last_name, email, password, passwordConfirm } = req.body
    if (!first_name || !last_name || !email || !password || !passwordConfirm)
        next(new AppError('You need to enter all required fields', 401))

    if (password !== passwordConfirm) next(new AppError('You need enter password same passwords', 401))

    const user = await User.create({ first_name, last_name, email, password, role: 'consumer' })

    const token = await createJwt(user.id)
    saveCookie(token, res)
    response(
        201,
        'You have registered as a client by id 1',
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
            accessToken: token,
        },
        res
    )
})

exports.signin = CatchError(async (req, res, next) => {
    const { password, email } = req.body
    if (!password || !email) next(new AppError('Email or Password could not be empty', 400))
    const oldUser = await User.findOne({
        where: { email, isActive: 1 },
        include: [{ model: Consumer }],
    })

    if (!oldUser) next(new AppError('Wrong password or email, Please try again', 400))
    // comparing passwords
    const compare = await bcrypt.compare(password, oldUser.password)
    if (!compare) next(new AppError('Wrong password or email, Please try again', 401))
    let user

    if (oldUser.role === 'consumer' && oldUser?.consumer) {
        const newUser = await User.findByPk(oldUser.id, {
            include: [
                {
                    model: Consumer,
                    include: [
                        { model: Personal_Trainer, include: [{ model: User }] },
                        {
                            model: Program,
                            include: [
                                {
                                    model: Meal,
                                    include: [
                                        {
                                            model: Food,
                                            include: [{ model: Recipe, include: Ingredient }],
                                        },
                                    ],
                                },
                            ],
                        },
                        { model: ConsumerDetails },
                    ],
                },
            ],
            attributes: { exclude: ['password', 'isActive'] },
        })
        const requested_nutritionists = []

        newUser?.consumer?.nutritionists.map((val) => {
            const bindConsumer = val.consumer_trainers
            if (bindConsumer.status === 0 && bindConsumer.invate_side === 'profesional') {
                const nutUser = val.user
                requested_nutritionists.push({
                    id: val.id,
                    first_name: nutUser.first_name,
                    last_name: nutUser.last_name,
                    photo: nutUser.photo,
                    email: nutUser.email,
                    linkToken: val.linkToken,
                    status: val.consumer_trainers.status,
                    room: val.consumer_trainers.room_number,
                    createdAt: val.createdAt,
                })
            }
        })

        user = UserType(newUser)
        const own_program = await Program.findByPk(user.consumer.program_id, {
            include: [
                {
                    model: Meal,
                    include: [
                        {
                            model: Food,
                            include: [{ model: Recipe, include: Ingredient }],
                        },
                    ],
                },
            ],
        })
        user.consumer.own_program = own_program
        if (requested_nutritionists.length !== 0) {
            user.requested_nutritionists = requested_nutritionists
        }
    } else if (oldUser.role === 'nutritionist') {
        user = await User.findByPk(oldUser.id, {
            include: [{ model: Personal_Trainer, include: [{ model: Consumer }] }],
            attributes: ['id', 'first_name', 'last_name', 'email', 'photo', 'role', 'createdAt'],
        })
        let count_consumer = 0
        user.nutritionist.consumers.map((val) => {
            if (val.consumer_trainers.status === 1) {
                count_consumer++
            }
        })

        user = {
            id: user.nutritionist.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role,
            active_clients: count_consumer,
            createdAt: user.createdAt,
        }
    } else if (oldUser.role === 'consumer' && !oldUser.consumer) {
    }
    const token = createJwt(oldUser.id)
    saveCookie(token, res)
    response(201, 'You are logged in successfully', true, { user, accessToken: token }, res)
})

exports.logout = CatchError(async (req, res, next) => {
    saveCookie('loggedOut', res)
    response(206, 'You are logged successfully', true, '', res)
})

exports.protect = CatchError(async (req, res, next) => {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.slice(7)
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt
    } else {
        next(new AppError('You are not authorized', 401))
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
    let user = req.user
    const oldUser = await User.findByPk(req.user.id, { include: [{ model: Consumer }] })

    if (req.user.role === 'consumer' && oldUser.consumer) {
        const newUser = await User.findByPk(req.user.id, {
            include: [
                {
                    model: Consumer,
                    include: [
                        { model: Personal_Trainer, include: [{ model: User }] },
                        {
                            model: Program,
                            include: [
                                {
                                    model: Meal,
                                    include: [
                                        {
                                            model: Food,
                                            include: [{ model: Swap }, { model: Recipe, include: Ingredient }],
                                        },
                                    ],
                                },
                            ],
                        },
                        { model: ConsumerDetails },
                    ],
                },
            ],
            attributes: { exclude: ['password', 'isActive'] },
        })

        const requested_nutritionists = []
        newUser?.consumer?.nutritionists.map((val) => {
            const bindConsumer = val.consumer_trainers
            if (bindConsumer.status === 0 && bindConsumer.invate_side === 'profesional') {
                const nutUser = val.user
                requested_nutritionists.push({
                    id: val.id,
                    first_name: nutUser.first_name,
                    last_name: nutUser.last_name,
                    photo: nutUser.photo,
                    email: nutUser.email,
                    linkToken: val.linkToken,
                    status: val.consumer_trainers.status,
                    room: val.consumer_trainers.room_number,
                    createdAt: val.createdAt,
                })
            }
        })
        user = UserType(newUser)

        if (requested_nutritionists.length !== 0) {
            user.requested_nutritionists = requested_nutritionists
        }
    } else if (req.user.role === 'nutritionist') {
        user = await User.findByPk(req.user.id, {
            include: [{ model: Personal_Trainer, include: [{ model: Consumer }] }],
            attributes: ['id', 'first_name', 'last_name', 'email', 'photo', 'role', 'createdAt'],
        })
        let count_consumer = 0
        user.nutritionist.consumers.map((val) => {
            if (val.consumer_trainers.status === 1) {
                count_consumer++
            }
        })
        user = {
            id: user.nutritionist.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role,
            active_clients: count_consumer,
            createdAt: user.createdAt,
        }
    }
    response(200, 'user data', true, { user }, res)
})

exports.role = (roles) => {
    return async (req, res, next) => {
        try {
            // 1) User ni roleni olamiz databasedan, tekshiramiz
            if (!roles.includes(req.user.role)) {
                return next(
                    new AppError(
                        `This process only for ${roles.join(',')} roles. (your role is a ${req.user.role})`,
                        405
                    )
                )
            }
            next()
        } catch (error) {
            next(new AppError(error.message, 400))
        }
    }
}

exports.signupNutritionist = CatchError(async (req, res, next) => {
    const { first_name, last_name, email, password, passwordConfirm } = req.body

    if (!first_name || !last_name || !email || !password || !passwordConfirm)
        next(new AppError('You need to enter all required fields', 400))

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
    response(201, 'You are logged successfully', true, { nutritionist: trainer, accessToken: token }, res)
})

exports.forgotPassword = CatchError(async (req, res, next) => {
    const email = req.body.email
    if (!email) {
        next(new AppError('You must need enter email for reset password', 400))
    }

    const user = await User.findOne({ where: { email } })
    if (!user) {
        next(new AppError(`User not found by email ${email}`, 400))
    }
    const token = crypto.randomBytes(32).toString('hex')
    const resetToken = crypto.createHash('sha256').update(token).digest('hex')
    user.resetToken = resetToken
    user.resetTokenDate = Date.now() + 10 * 60 * 1000
    const resetLink = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${token}`
    await SendMessageToMail(user.email, resetLink)
    await user.save({ validate: false })

    response(200, `to email ${email} sended reset url`, true, { token }, res)
})

exports.resetPassword = CatchError(async (req, res, next) => {
    const token = req.params.token
    const { password, passwordConfirm } = req.body
    const resetToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({ where: { resetToken } })

    if (!user) {
        next(new AppError('Invalid token', 400))
    }

    if (!password || !passwordConfirm) {
        next(new AppError('You need enter passwords', 400))
    }
    if (password !== passwordConfirm) {
        next(new AppError('You must enter same passwords', 400))
    }

    user.password = password
    await user.save({ validate: false })
    response(200, 'You are successfully changed password', true, '', res)
})

exports.updatePassword = CatchError(async (req, res, next) => {
    const { password, newPassword, newPasswordConfirm } = req.body
    if (password === newPassword) {
        next(new AppError('new password and old password dont need to be same', 400))
    }
    const user = await User.findByPk(req.user.id)

    if (!(await bcrypt.compare(password, user.password))) {
        next(new AppError('wrong password, please try again', 401))
    }
    user.password = newPassword
    await user.save({ validate: false })
    response(200, 'You are successfully changed your password', true, '', res)
})
