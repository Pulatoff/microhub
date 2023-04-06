const sequelize = require('../configs/db')
const { DataTypes } = require('sequelize')
const Trainer = require('./personalTrainerModel')
const set_error = require('../utils/errorModel')
const s3Client = require('../configs/s3Client')
const { GetObjectCommand } = require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')

const Upload = sequelize.define(
    'trainerUploads',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        title: { type: DataTypes.STRING, allowNull: false },
        filename: { type: DataTypes.STRING, allowNull: false },
        fileType: { type: DataTypes.STRING, allowNull: false },
        fileUrl: { type: DataTypes.STRING, allowNull: false },
    },
    { timestamps: true, createdAt: true, updatedAt: false }
)

Trainer.hasMany(Upload)
Upload.belongsTo(Trainer)

module.exports = Upload
