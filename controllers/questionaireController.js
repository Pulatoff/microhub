// utils
const CatchError = require('../utils/catchErrorAsyncFunc')
const AppError = require('../utils/AppError')
const response = require('../utils/response')
// models
const Questionnaire = require('../models/questionnaireModel')
const QuestionnaireQuestion = require('../models/questionnariesQuestionModel')

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
        home_number,
    } = req.body
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
        !home_number
    )
        next(new AppError('You must enter all fields', 404))

    const questionnaire = await Questionnaire.create({
        email,
        lowest_height,
        lowest_weight,
        home_number,
        work_phone_number,
        date_of_birth,
        weight,
        height,
        name,
        date,
    })
    for (let i = 0; i < questions.length; i++) {
        if (questions[i].question && questions[i].answer) {
            const quesetions = await QuestionnaireQuestion.create({
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
    response(201, 'You are successfully sended your questionaire', true, '', res)
})
