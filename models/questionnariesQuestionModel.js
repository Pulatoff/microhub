const { DataTypes } = require('sequelize')
// configs
const sequelize = require('../configs/db')
//models
const Questionnaire = require('./questionnaireModel')

const QuestionnaireQuestion = sequelize.define(
    'questionnaire_options',
    {
        question: { type: DataTypes.STRING, allowNull: false },
        answer: { type: DataTypes.STRING, allowNull: false },
        additional_question: { type: DataTypes.STRING },
        additional_answer: { type: DataTypes.STRING },
        details: { type: DataTypes.STRING },
    },
    { timestamps: true, createdAt: true, updatedAt: false }
)

Questionnaire.hasMany(QuestionnaireQuestion)
QuestionnaireQuestion.belongsTo(Questionnaire)

module.exports = QuestionnaireQuestion
