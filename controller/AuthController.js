const database = require('../db/database')
const { generateAccessToken } = require('../config');

class AuthController {
    async login(req, res) {
        try {
            const {login, password} = req.body
            const user = await database.query(`select * from users where login = $1 and password = $2`, [login, password])
            if (!user.rows.length) {
                return res.status(404).json({ message: "Пользователь не найден" });
            }
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
