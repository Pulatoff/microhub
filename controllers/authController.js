const User = require('../models/userModel')
const createJwt = require('../utils/createJWT')
const bcrypt = require('bcryptjs')

exports.signup = async (req, res, next) => {
    try {
        const { first_name, last_name, email, password, passwordConfirm } = req.body
        // checking the saming => password and passwordConfirm
        if (password !== passwordConfirm) throw new Error('password not the same')
        // checking user existing
        const user = await User.create({ first_name, last_name, email, password })
        const token = await createJwt(user.id)
        res.status(200).json({
            status: 'success',
            data: {
                accessToken: `Bearer ${token}`,
                user,
            },
        })
    } catch (error) {
        console.log(error)
        res.status(404).json({ message: error.message })
    }
}
exports.signin = async (req, res, next) => {
    try {
        const { password, email } = req.body
        if (!password || !email) throw new Error('field could not be pustim')
        const user = await User.findOne({ where: { email } })
        if (!user) throw new Error('Wrong password or email, Please try again')
        // comparing passwords
        const compare = await bcrypt.compare(password, user.password)
        if (!compare) throw new Error('Wrong password or email, Please try again')
        const token = createJwt(user.id)
        res.status(200).json({ status: 'succes', data: { user, accessToken: `Bearer ${token}` } })
    } catch (error) {
        console.log(error.message)
        res.status(404).json({
            status: 'failed',
            message: error.message,
        })
    }
}
