const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')

const s3Client = new S3Client({
    endpoint: 'https://sgp1.digitaloceanspaces.com',
    forcePathStyle: false,
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.DO_ACCESS_KEY,
        secretAccessKey: process.env.DO_SECRET_KEY,
    },
})

module.exports = s3Client
