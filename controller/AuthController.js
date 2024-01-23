const database = require('../db/database')
const {secret} = require("../config")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateAccessToken = (id, login) => {
    const payload = {
        id,
        login
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"})
}
class AuthController {
    async login(req, res) {
        try {
            const {login, password} = req.body
            const user = await database.query(`select * from users where login = $1 and password = $2`, [login, password])
            const validPassword = bcrypt.compareSync(password, user.rows[0].password)
            console.log(password + " " + user.rows[0].password)
            const token = generateAccessToken(user.rows[0].id, user.rows[0].login)
            return res.json({token})
        } catch (e) {
          res.json({
              message: 'Что-то пошло не так'
          })
        }
    }
}

module.exports = new AuthController()
