const secret = "sl1degod"
const refreshSecret = 'sl1degod86';
const jwt = require('jsonwebtoken');

const generateAccessToken = (id, login) => {
    const payload = {
        id,
        login
    }
    return jwt.sign(payload, secret, {expiresIn: "30m"})
}


module.exports = { secret, refreshSecret, generateAccessToken };