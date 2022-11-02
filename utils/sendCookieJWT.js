const saveCookie = (token, res) => {
    res.cookie('jwt', token, { maxAge: 24 * 60 * 60 * 1000 * process.env.JWT_COOKIE_EXPIRES_IN })
}

module.exports = saveCookie
