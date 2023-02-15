//models
const Consumer = require('../models/consumerModel')
const Trainer = require('../models/personalTrainerModel')
const User = require('../models/userModel')
const Program = require('../models/programModel')
const Food = require('../models/mealModel')
const Meal = require('../models/programTimeModel')
const Swap = require('../models/swaperModel')
const ConsumerTrainer = require('../models/consumerTrainerModel')
const Ingredient = require('../models/ingredientModel')
const Recipe = require('../models/recipeModel')
// utils
const CatchError = require('../utils/catchErrorAsyncFunc')
const response = require('../utils/response')
const checkInvate = require('../utils/checkInvate')
const AppError = require('../utils/AppError')
const Questionnaire = require('../models/questionnaireModel')
const QuestionnaireQuestion = require('../models/questionnariesQuestionModel')
const ConsumerDetails = require('../models/consumerDetailsModel')

const resConsumerType = (consumer) => {
    return {
        id: consumer.id,
        height: consumer.height,
        weight: consumer.weight,
        favorite_foods: consumer.favorite_foods,
        least_favorite_foods: consumer.least_favorite_foods,
        allergies: consumer.allergies,
        preferences: consumer.preferences,
        hip: consumer.hip,
        forearm: consumer.forearm,
        wrist: consumer.wrist,
        waist: consumer.waist,
        user: consumer.user,
    }
}
/* # POST /api/v1/consumers
 * role: consumer
 */
exports.addConsumer = CatchError(async (req, res, next) => {
    const {
        weight,
        height,
        favorite_foods,
        least_favorite_foods,
        allergies,
        preferences,
        gender,
        activity_level,
        wrist,
        forearm,
        hip,
        waist,
    } = req.body

    const oldConsumer = await Consumer.findOne({ where: { userId: req.user.id } })
    if (oldConsumer) next(new AppError('This consumer details already exists', 403))

    const consumer = await Consumer.create({
        weight,
        height,
        favorite_foods,
        least_favorite_foods,
        allergies,
        preferences,
        gender,
        userId: req.user.id,
        activity_level,
        wrist,
        waist,
        hip,
        forearm,
    })

    const { invitationToken } = req.cookies
    if (invitationToken) {
        await checkInvate({ consumerId: consumer.id, invitationToken })
    }

    response(201, 'You are add consumer details successfully', true, { consumer }, res)
})

/* # GET /api/v1/consumers
 * role: admin
 */
exports.getConsumers = CatchError(async (req, res, next) => {
    const consumers = await Consumer.findAll({
        include: [
            {
                model: Program,
                where: { nutritionistId: trainer.id },
                include: [{ model: ProgramTime, include: [{ model: Meal }] }],
            },
            { model: User, attributes: ['id', 'first_name', 'last_name', 'email', 'role', 'photo', 'createdAt'] },
        ],
    })
    const newConsumers = []
    for (let i = 0; i <= consumers.length - 1; i++) {
        const newUser = {
            favorite_foods: consumers[i].favorite_foods,
            least_favorite_foods: consumers[i].least_favorite_foods,
            allergies: consumers[i].allergies,
            body_fat: consumers[i].body_fat,
            tdee: consumers[i].tdee,
            body_frame: consumers[i].body_frame,
            healthy_weight: consumers[i].healthy_weight,
            bmi: consumers[i].bmi,
            daily_targets: consumers[i].daily_targets,
            id: consumers[i].id,
            weight: consumers[i].weight,
            height: consumers[i].height,
            wrist: consumers[i].wrist,
            forearm: consumers[i].forearm,
            hip: consumers[i].hip,
            waist: consumers[i].waist,
            gender: consumers[i].gender,
            activity_level: consumers[i].activity_level,
            preferences: consumers[i].preferences,
            createdAt: consumers[i].createdAt,
            program: consumers[i].programs[0] ? consumers[i].programs[0] : {},
            user: consumers[i].user,
        }
        newConsumers.push(newUser)
    }
    response(200, 'Successfuly geting consumer', true, { consumers: newConsumers }, res)
})

/* #PATCH /api/v1/consumers/:id
 * role: consumer
 */
exports.updateConsumer = CatchError(async (req, res, next) => {
    const userId = req.user.id

    const consumer = await Consumer.findOne({ where: { userId } })
    const { weight, height, favorite_foods, least_favorite_foods, allergies, preferences, gender, activity_level } =
        req.body

    if (weight || height) {
        const date = new Date()
        const last_track = await ConsumerDetails.findAll({
            where: { consumerId: consumer.id },
            order: [['id', 'DESC']],
        })

        await ConsumerDetails.create({
            weight: consumer.weight,
            height: consumer.height,
            from_date: last_track[0]?.createdAt || consumer?.createdAt || date.toISOString(),
            to_date: date.toISOString(),
            consumerId: consumer.id,
        })
    }

    consumer.height = height || consumer.height
    consumer.weight = weight || consumer.weight
    consumer.favorite_foods = favorite_foods || consumer.favorite_foods
    consumer.least_favorite_foods = least_favorite_foods || consumer.least_favorite_foods
    consumer.allergies = allergies || consumer.allergies
    consumer.preferences = preferences || consumer.preferences
    consumer.gender = gender || consumer.gender
    consumer.activity_level = activity_level || consumer.activity_level

    await consumer.save({ validate: true })
    const newConsumer = await Consumer.findByPk(consumer.id, {
        include: [{ model: ConsumerDetails, limit: 1, order: [['id', 'DESC']] }],
    })

    response(203, 'You are successfully update data', true, { consumer: newConsumer }, res)
})

/* # GET /api/v1/consumers/trainers/request
 * role: consumer
 */
exports.getRequestedTrainers = CatchError(async (req, res, next) => {
    const userId = req.user.id
    const consumer = await Consumer.findOne({ where: { userId }, include: [{ model: Trainer, include: User }] })

    const nutritionists = consumer.nutritionists.map((val) => {
        if (val.consumer_trainers.status === 0 && val.consumer_trainers?.invate_side === 'profesional') {
            return {
                id: val.id,
                first_name: val.user.first_name,
                last_name: val.user.last_name,
                photo: val.user.photo,
                email: val.user.email,
                linkToken: val.linkToken,
                status: val.consumer_trainers.status,
                createdAt: val.createdAt,
            }
        }
    })

    response(200, 'Successfully geting own nutritionists', true, { nutritionists }, res)
})

/*
 *
 */
exports.getTrainers = CatchError(async (req, res, next) => {
    const userId = req.user.id
    const consumer = await Consumer.findOne({ where: { userId }, include: [{ model: Trainer, include: User }] })

    const nutritionists = consumer.nutritionists.map((val) => {
        if (val.consumer_trainers.status === 2) {
            return {
                id: val.id,
                first_name: val.user.first_name,
                last_name: val.user.last_name,
                photo: val.user.photo,
                email: val.user.email,
                linkToken: val.linkToken,
                status: val.consumer_trainers.status,
                createdAt: val.createdAt,
            }
        }
    })

    response(200, 'Successfully geting own nutritionists', true, { nutritionists }, res)
})

// middleware
exports.protectConsumer = CatchError(async (req, res, next) => {
    const consumer = await Consumer.findOne({ where: { userId: req.user.id } })
    if (!consumer) next(new AppError('You need enter some options for doing this work!', 404))
    req.consumer = consumer
    next()
})

/* # POST /api/v1/consumers/accept
 * role: consumer
 */

exports.acceptNutritioinst = CatchError(async (req, res, next) => {
    const { nutritionistId, status, questionnaire } = req.body
    const userId = req.user.id
    const consumer = await Consumer.findOne({ where: { userId } })
    const nutritionist = await Trainer.findByPk(nutritionistId)
    if (!nutritionist) next(new AppError('This nutritionist is not exist!', 404))

    const updateModel = await ConsumerTrainer.findOne({
        where: { nutritionistId, consumerId: req.consumer.id, status: 0 },
    })

    if (!updateModel) next(new AppError('this not send request or HSQ at another stage', 404))

    if (status === 1) {
        const questionnair = await Questionnaire.create({
            email: questionnaire.email,
            lowest_height: questionnaire.lowest_height,
            lowest_weight: questionnaire.lowest_weight,
            home_phone_number: questionnaire.home_phone_number,
            work_phone_number: questionnaire.work_phone_number,
            date_of_birth: questionnaire.date_of_birth,
            weight: questionnaire.weight,
            height: questionnaire.height,
            name: questionnaire.name,
            date: questionnaire.date,
            consumerId: consumer.id,
            nutritionistId,
        })
        const questions = questionnaire.questions
        for (let i = 0; i < questions.length; i++) {
            if (questions[i].question && questions[i].answer) {
                await QuestionnaireQuestion.create({
                    questionnairyId: questionnair.id,
                    question: questions[i].question,
                    answer: questions[i].answer,
                    additional_question: questions[i].additional_question,
                    additional_answer: questions[i].additional_answer,
                    details: questions[i].details,
                })
            } else {
                next(new AppError('You must enter question and Answer', 404))
            }
        }
        updateModel.status = status
        await updateModel.save()

        response(206, `Client accept Nutritionist by id ${nutritionistId}`, true, '', res)
    } else {
        updateModel.status = status
        await updateModel.save()

        response(206, `Client reject Nutritionist by id ${nutritionistId}`, true, '', res)
    }
})

exports.getOneConsumer = CatchError(async (req, res, next) => {
    const { id } = req.params
    const userId = req.user.id
    const trainer = await Trainer.findOne({ where: { userId } })
    if (!trainer) next(new AppError('Nutritionist not exist', 404))
    const consumer = await Consumer.findByPk(id, {
        include: [
            { model: User, attributes: ['id', 'first_name', 'last_name', 'email', 'role', 'photo', 'createdAt'] },
            {
                model: Program,
                include: [{ model: ProgramTime, include: [{ model: Meal }] }],
                where: { nutritionistId: trainer.id },
            },
        ],
    })
    const newUser = {
        favorite_foods: consumer.favorite_foods,
        least_favorite_foods: consumer.least_favorite_foods,
        allergies: consumer.allergies,
        body_fat: consumer.body_fat,
        tdee: consumer.tdee,
        body_frame: consumer.body_frame,
        healthy_weight: consumer.healthy_weight,
        bmi: consumer.bmi,
        daily_targets: consumer.daily_targets,
        id: consumer.id,
        weight: consumer.weight,
        height: consumer.height,
        wrist: consumer.wrist,
        forearm: consumer.forearm,
        hip: consumer.hip,
        waist: consumer.waist,
        gender: consumer.gender,
        activity_level: consumer.activity_level,
        preferences: consumer.preferences,
        createdAt: consumer.createdAt,
        program: consumer.programs[0] ? consumer.programs[0] : {},
        user: consumer.user,
    }
    response(200, 'successfully consumer', true, { consumer: newUser }, res)
})

exports.getOnwProgram = CatchError(async (req, res, next) => {
    const userId = req.user.id
    const consumer = await Consumer.findOne({ where: { userId } })

    const program = await Program.findByPk(consumer?.program_id, {
        include: [
            {
                model: Meal,
                include: [
                    {
                        model: Food,
                        include: [{ model: Recipe, include: Ingredient }, { model: Swap }],
                    },
                ],
            },
        ],
    })
    response(200, 'You are successfully get own program', true, { program }, res)
})
