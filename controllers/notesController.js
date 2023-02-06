const Notes = require('../models/notesModel')
const Trainer = require('../models/personalTrainerModel')
const response = require('../utils/response')
const Consumer = require('../models/consumerModel')
const AppError = require('../utils/AppError')
const CatchError = require('../utils/catchErrorAsyncFunc')

exports.addNotes = CatchError(async (req, res, next) => {
    const note = req.body.note
    const consumerId = req.params.consumerId
    const userId = req.user.id
    const trainer = await Trainer.findOne({ where: { userId } })
    const consumer = await Consumer.findByPk(consumerId, { include: [{ model: Trainer, where: { id: trainer.id } }] })
    if (!consumer) next(new AppError(`Not found consumer by id: ${consumerId}`))

    const nutritionist = consumer.nutritionists[0]
    if (!nutritionist || nutritionist.consumer_trainers.status !== 2) {
        throw new Error(`You are not assigned with consumer by id: ${consumerId}`)
    }
    await Notes.create({ note, consumerId, nutritionistId: trainer.id })
    response(201, 'You successfully create note', true, '', res)
})

exports.getAllNotes = CatchError(async (req, res, next) => {
    let { number, offset } = req.body
    number = number || undefined
    offset = offset || undefined

    const consumerId = req.params.consumerId
    const userId = req.user.id
    const trainer = await Trainer.findOne({ userId })
    const notes = await Notes.findAll({ where: { nutritionistId: trainer.id, consumerId }, offset, limit: number })
    response(200, 'You successfully get notes', true, { notes }, res, notes.length)
})

exports.getOneNote = CatchError(async (req, res, next) => {
    const { consumerId, id } = req.params
    const userId = req.user.id
    const trainer = await Trainer.findOne({ where: { userId } })
    const note = await Notes.findByPk(id, { consumerId, nutritionistId: trainer.id })
    if (!note) throw new Error(`Not found note by id: ${id}`)
    response(200, `You get note by id: ${id}`, true, { note }, res)
})

exports.updateNote = CatchError(async (req, res, next) => {
    const { consumerId, id } = req.params
    const note = req.body.note
    const userId = req.user.id
    const trainer = await Trainer.findOne({ where: { userId } })
    const notes = await Notes.findByPk(id, { where: { consumerId, nutritionistId: trainer.id } })
    notes.note = note || notes.note
    await notes.save()
    response(203, 'you successfully update note', true, '', res)
})

exports.deletNote = CatchError(async (req, res, next) => {
    const id = req.params.id
    await Notes.destroy({ where: { id } })
    response(206, '', true, '', res)
})
