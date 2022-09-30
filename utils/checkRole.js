const User = require('../models/userModel')
async function checkRole({ req, user_id }) {
    const role = await User.findByPk(user_id, {
        attributes: ['role'],
    })
    return role
}

module.exports = checkRole
