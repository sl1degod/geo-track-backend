const db = require('../db/database')

class ObjectsController {

    async getAllObjects(req, res) {
        res.json('objects is working')
    }

    async getObjects(req, res) {

    }

    async createObject(req, res) {

    }

    async updateObjects(req, res) {

    }

}

module.exports = new ObjectsController()