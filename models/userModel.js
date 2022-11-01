const sequelize = require('../configs/db')
const bcrypt = require('bcryptjs')
const { DataTypes } = require('sequelize')

const User = sequelize.define(
    'users',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        first_name: { type: DataTypes.STRING, allowNull: false },
        last_name: { type: DataTypes.STRING, allowNull: false },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: 'Please provide a password' },
                len: {
                    args: [8, 20],
                    msg: 'The password should be between 8 and 20 characters',
                },
            },
        },
        photo: { type: DataTypes.STRING, defaultValue: 'default.jpg ' },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                args: true,
                msg: 'Oops. Looks like you already have an account with this email address. Please try to login.',
                fields: [sequelize.fn('lower', sequelize.col('email'))],
            },
            validate: {
                isEmail: {
                    args: true,
                    msg: 'The email you entered is invalid or is already in our system.',
                },
                max: {
                    args: 254,
                    msg: 'The email you entered is invalid or longer than 254 characters.',
                },
            },
        },
        role: {
            type: DataTypes.ENUM('consumer', 'personal_trainer', 'nutritionist', 'admin'),
            allowNull: false,
            defaultValue: 'consumer',
        },
        isActive: { type: DataTypes.INTEGER, defaultValue: 1 },
    },
    {
        indexes: [
            {
                unique: true,
                fields: ['email'],
            },
        ],
        timestamps: true,
        createdAt: true,
        updatedAt: false,
    }
)

// hashing password before create
User.addHook('beforeSave', async (user, options) => {
    const hashedPassword = await bcrypt.hash(user.password, 12)
    user.password = hashedPassword
})

module.exports = User
