const database = require('../db/database')

class ViolationsController {

    async getAllViolations(req, res) {
        const vio = await database.query('select * from TypeOfViolations')
        res.json(vio.rows)
    }

    async getViolations(req, res) {
        const id = req.params.id
        const vio = await database.query('select * from TypeOfViolations where id = $1', [id])
        res.json(vio.rows[0])
    }
}

module.exports = new ViolationsController()