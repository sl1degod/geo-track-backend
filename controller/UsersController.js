const database = require('../db/database')

class UsersController {

    async getUsers(req, res) {
        const users = await database.query('select users.id, users.firstname, users.secondname, users.lastname, users.image, posts.name as post, users.login, users.password from users, posts where users.post_id = posts.id order by users.id')
        res.json(users.rows)
    }

    async getUser(req, res) {
        const id = req.params.id
        const user = await database.query('select users.firstname, users.secondname, users.lastname, users.image, posts.name as post, users.login, users.password from users, posts where users.post_id = posts.id and users.id = $1', [id])
        res.json(user.rows[0])
    }

    async createUsers(req, res) {
        let {firstname, secondname, lastname, post_id, login, password} = req.body;
        try {
            const newUser = await database.query(`insert into users (firstname, secondname, lastname, post_id, login, password) values($1, $2, $3, $4, $5, $6) RETURNING *`, [firstname, secondname, lastname, post_id, login, password])
            res.json(newUser.rows[0])

        } catch (error) {
            res.json({
                message: "Во время создания пользователя произошла ошибка"
            })
        }
    }

    async updateUser(req, res) {
        const id = req.params.id
        let {firstname, secondname, lastname, post_id, login, password} = req.body;
        const user = await database.query('update users set firstname = $1, secondname = $2, lastname = $3, post_id = $4, login = $5, password = $6 where id = $7 RETURNING *', [firstname, secondname, lastname, post_id, login, password, id])
        res.json(user.rows[0])
    }
}

module.exports = new UsersController()
