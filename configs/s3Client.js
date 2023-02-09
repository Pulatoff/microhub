const { S3Client } = require('@aws-sdk/client-s3')

const s3Client = new S3Client({
    endpoint: process.env.DO_SPACE_ENDPOINT,
    forcePathStyle: false,
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.DO_ACCESS_KEY,
        secretAccessKey: process.env.DO_SECRET_KEY,
    },
})

module.exports = s3Client
