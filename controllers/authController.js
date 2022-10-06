const User = require('../models/userModel')
const createJwt = require('../utils/createJWT')
exports.signup = async (req, res, next) => {
    try {
        const { first_name, last_name, email, password, passwordConfirm } = req.body
        // checking the saming => password and passwordConfirm
        if (password !== passwordConfirm) throw new Error('password not the same')
        // checking user existing
        const user = await User.create({ first_name, last_name, email, password })
        const jwt = await createJwt(user.id)
        res.status(200).json({
            status: 'success',
            data: {
                accessToken: `Bearer ${jwt}`,
                user,
            },
        })
    } catch (e) {
        console.log(e)
        res.status(404).json({ message: e.message })
    }
}
