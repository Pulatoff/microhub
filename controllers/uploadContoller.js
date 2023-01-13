const { PutObjectCommand } = require('@aws-sdk/client-s3')
const s3Client = require('../configs/s3Client')
const CatchAsync = require('../utils/catchErrorAsyncFunc')
const sharp = require('sharp')
const multer = require('multer')
const response = require('../utils/response')

const storage = multer.memoryStorage()

exports.upload = multer({ storage })

exports.uploadFile = CatchAsync(async (req, res, next) => {
    const file = req.file
    const Key = 'niyozbek.jpg'
    const Bucket = 'microhub'
    const fileBuffer = await sharp(file.buffer).toBuffer()

    await s3Client.send(
        new PutObjectCommand({
            Key,
            Bucket,
            Body: fileBuffer,
            ContentType: file.mimetype,
        })
    )
    response(200, 'successfully uploaded', true, '', res)
})
