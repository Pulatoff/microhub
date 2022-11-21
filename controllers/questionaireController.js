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
        birth_of_date,
        weight,
        height,
        email,
        lowest_height,
        lowest_weight,
        work_phone_number,
    } = req.body
    if (
        !questions ||
        !name ||
        !date ||
        !birth_of_date ||
        !weight ||
        !height ||
        !email ||
        !lowest_height ||
        !lowest_weight
    )
        next(new AppError('You must enter all fields', 404))
})
