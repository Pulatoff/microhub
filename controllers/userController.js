const User = require('../models/userModel')
const s3Client = require('../configs/s3Client')
const crypto = require('crypto')
const { PutObjectCommand } = require('@aws-sdk/client-s3')

const multer = require('multer')
// utils
const response = require('../utils/response')
const CatchError = require('../utils/catchErrorAsyncFunc')

const storage = multer.memoryStorage()

exports.upload = multer({ storage }).single('photo')

exports.addUser = CatchError(async (req, res, next) => {
    response(201, 'You are successfully created user', true, {}, res)
})

exports.getUser = CatchError(async (req, res, next) => {
    const { id } = req.params
    const { sort, page, limit } = req.query
    const user = await User.findByPk(id)
    // sort models ?sort=createdAt
    // selecting fields
    // pagination fields

    User.findAll({
        order: [], // for sorting
        attributes: { exclude: [] }, // fort selecting fields
        offset: 2,
        limit: 2,
    })
    response(200, 'You are successfully get one user', true, { user }, res)
})

exports.getUsers = CatchError(async (req, res, next) => {
    const { field } = req.query
    const fields = field.split(',')

    const attribute = {
        exclude: [],
        include: [],
    }

    fields.map((val) => {
        if (val.startsWith('-')) {
            attribute.exclude.push(val.slice(1))
        } else {
            attribute.include.push(val)
        }
    })

    const users = await User.findAll({
        order: [['id', 'DESC']],
        attributes: attribute,
        offset: 2,
        limit: 2,
    })
    response(200, 'You are successfully get all users', true, { users }, res)
})

exports.uploadPhoto = CatchError(async (req, res, next) => {
    const file = req.file
    const id = req.user.id
    const user = await User.findByPk(id)
    const generateFilename = (byte = 32) => crypto.randomBytes(byte).toString('hex')

    const filename = 'user-photos/' + generateFilename() + '.' + req.filename.split('/')[1]
    await s3Client.send(
        new PutObjectCommand({
            ACL: 'public-read-write',
            Key: filename,
            Bucket: process.env.DO_SPACE_BUCKET,
            Body: file.fileBuffer,
            ContentType: file.mimetype,
        })
    )
    const photo = process.env.DO_SPACE_URL + filename
    user.photo = photo
    await user.save({ validate: false })
    response(200, 'You are successfully upload photo', true, { photo }, res)
})
