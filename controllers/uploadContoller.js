const { PutObjectCommand, GetObjectCommand, DeleteObjectsCommand } = require('@aws-sdk/client-s3')
const s3Client = require('../configs/s3Client')
const CatchAsync = require('../utils/catchErrorAsyncFunc')
const multer = require('multer')
const response = require('../utils/response')
const crypto = require('crypto')
const Trainer = require('../models/personalTrainerModel')
const Upload = require('../models/uploadModel')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')

const storage = multer.memoryStorage()

exports.upload = multer({ storage })

exports.uploadFile = CatchAsync(async (req, res, next) => {
    const userId = req.user.id
    const file = req.file
    const title = req.body.title
    const trainer = await Trainer.findOne({ where: { userId } })

    const generateFilename = (byte = 32) => crypto.randomBytes(byte).toString('hex')
    const fileBuffer = file.buffer

    const filename = generateFilename()

    await s3Client.send(
        new PutObjectCommand({
            Key: filename,
            Bucket: process.env.DO_SPACE_BUCKET,
            Body: fileBuffer,
            ContentType: file.mimetype,
        })
    )

    const upload = await Upload.create({
        title,
        filename,
        nutritionistId: trainer.id,
    })

    response(
        201,
        'your file successfully uploaded to server',
        true,
        { upload: { file_url: upload.file_url, createadAt: upload.createadAt } },
        res
    )
})

exports.getUploads = CatchAsync(async (req, res, next) => {
    const userId = req.user.id
    const trainer = await Trainer.findOne({ where: { userId } })

    const uploads = await Upload.findAll({ where: { nutritionistId: trainer.id } })
    const files = []
    for (let upload of uploads) {
        const file_url = await getSignedUrl(
            s3Client,
            new GetObjectCommand({ Key: upload.filename, Bucket: process.env.DO_SPACE_BUCKET }),
            { expiresIn: 3600 * 24 }
        )

        files.push({ id: upload.id, title: upload.title, file_url, createdAt: upload.createdAt })
    }
    response(200, 'You are successfully get own uploads', true, { uploads: files }, res)
})

exports.updateUploads = CatchAsync(async (req, res, next) => {
    const title = req.body.title
    const id = req.params.id
    const userId = req.user.id
    const trainer = await Trainer.findOne({ where: { userId } })
    const upload = await Upload.findByPk(id, { where: { nutritionistId: trainer.id } })
    upload.title = title || upload.title
    await upload.save()
    response(203, 'You are successfully update', true, '', res)
})

exports.deleteUpload = CatchAsync(async (req, res, next) => {
    const id = req.params.id
    const upload = await Upload.findByPk(id)
    await upload.destroy()
    response(206, 'You successfully deleted a file', true, '', res)
})

exports.downloadFile = CatchAsync(async (req, res, next) => {
    const id = req.params.id
})

// 45e8eb06f0028c4fe093d3a0dfec846b2ba750bb63ca7dbc0bce0aa9972fe0c0
// 45e8eb06f0028c4fe093d3a0dfec846b2ba750bb63ca7dbc0bce0aa9972fe0c0
