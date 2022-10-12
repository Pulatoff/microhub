// const sequelize = require('../configs/db')
// const { DataTypes } = require('sequelize')

// const Nutrisionist = sequelize.define('nutrisionist', {
//     first_name: { type: DataTypes.STRING, allowNull: false },
//     last_name: { type: DataTypes.STRING, allowNull: false },
//     email: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         unique: {
//             args: true,
//             message: 'Oops. Looks like you already have an account with this email address. Please try to login.',
//             fields: [sequelize.fn('lower', sequelize.col('email'))],
//         },
//         validate: {
//             isEmail: {
//                 args: true,
//                 msg: 'The email you entered is invalid or is already in our system.',
//             },
//             max: {
//                 args: 254,
//                 msg: 'The email you entered is invalid or longer than 254 characters.',
//             },
//         },
//     },
//     password: {
//         type: DataTypes.STRING,
//     },
// })
