const database = require('../db/database')
const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken } = require('../config');

class AuthController {
    async login(req, res) {
        try {
            const {login, password} = req.body
            const user = await database.query(`select * from users where login = $1 and password = $2`, [login, password])
            const validPassword = bcrypt.compareSync(password, user.rows[0].password)
            console.log(password + " " + user.rows[0].password)
            const token = generateAccessToken(user.rows[0].id, user.rows[0].login)
            const refreshToken = generateRefreshToken(user.rows[0].id, user.rows[0].login)
            return res.json({token, refreshToken})
    
        } catch (e) {
          res.json({
              message: 'Что-то пошло не так'
          })
        }
    }
}

module.exports = new AuthController()
