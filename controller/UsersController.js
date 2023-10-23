const database = require('../db/database')

class UsersController {

    async getUsers(req, res) {
        // res.send('users is working')
        res.json('123')

    }

    async getUser(req, res) {

    }

    async createUsers(req, res) {

    }

    async updateUser(req, res) {

    }
}

module.exports = new UsersController()
