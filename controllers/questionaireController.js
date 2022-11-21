// utils
const CatchError = require('../utils/catchErrorAsyncFunc')
const AppError = require('../utils/AppError')
const response = require('../utils/response')
// models
const Questionnaire = require('../models/questionnaireModel')
const QuestionnaireQuestion = require('../models/questionnariesQuestionModel')
const Consumer = require('../models/consumerModel')
const Trainer = require('../models/personalTrainerModel')
const ConsumerTrainer = require('../models/consumerTrainer')

exports.sendQuestionnaire = CatchError(async (req, res, next) => {
    const {
        questions,
        name,
        date,
        date_of_birth,
        weight,
        height,
        email,
        lowest_height,
        lowest_weight,
        work_phone_number,
        home_phone_number,
        nutritionistId,
    } = req.body
    const userId = req.user.id
    if (
        !questions ||
        !name ||
        !date ||
        !date_of_birth ||
        !weight ||
        !height ||
        !email ||
        !lowest_height ||
        !lowest_weight ||
        !work_phone_number ||
        !home_phone_number
    )
        next(new AppError('You must enter all fields', 404))

    const consumer = await Consumer.findOne({ where: { userId } })

    const questionnaire = await Questionnaire.create({
        email,
        lowest_height,
        lowest_weight,
        home_phone_number,
        work_phone_number,
        date_of_birth,
        weight,
        height,
        name,
        date,
        consumerId: consumer.id,
        nutritionistId: nutritionistId,
    })
    for (let i = 0; i < questions.length; i++) {
        if (questions[i].question && questions[i].answer) {
            await QuestionnaireQuestion.create({
                questionnairyId: questionnaire.id,
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
    await ConsumerTrainer.create({ nutritionistId, consumerId: consumer.id })
    response(201, 'You are successfully sended your questionaire', true, '', res)
})

exports.getSendingQuestionnaire = CatchError(async (req, res, next) => {
    const userId = req.user.id
    const trainer = await Trainer.findOne({ where: { userId } })
    const questionaire = await Questionnaire.findAll({
        where: { nutritionistId: trainer.id },
        attributes: [
            'id',
            'name',
            'date',
            'date_of_birth',
            'home_phone_number',
            'work_phone_number',
            'weight',
            'height',
            'email',
            'lowest_height',
            'lowest_weight',
            'createdAt',
        ],
        include: [
            {
                model: QuestionnaireQuestion,
                attributes: ['question', 'answer', 'additional_question', 'additional_answer', 'details'],
            },
        ],
    })
    response(200, 'You are successfully getting sended questionnaires', true, { questionaire }, res)
})
