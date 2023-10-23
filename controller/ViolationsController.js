const db = require('../db/database')

class ViolationsController {

    async getAllViolations(req, res) {
        res.json('violations is working')

    }

    async getViolations(req, res) {

    }
}

module.exports = new ViolationsController()