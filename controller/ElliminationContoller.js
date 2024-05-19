const database = require('../db/database')
const moment = require("moment/moment");

class EliminationController {

    async getAllEliminations(req, res) {
        const vio = await database.query('select * from Elimination')
        res.json(vio.rows)
    }

}

module.exports = new EliminationController()