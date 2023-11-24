const database = require('../db/database')
const moment = require("moment/moment");

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

    async getCharViolations(req, res) {
        const vio = await database.query(`select typeofviolations.id, report.date_report as date, count (report.object_id) as count, typeofviolations.name as violation 
                                            from report 
                                            left join reportviolations on reportviolations.id = report.rep_vio_id 
                                            left join typeofviolations on typeofviolations.id = reportviolations.violations_id 
                                            group by date, report.object_id, violation, typeofviolations.id
                                            order by report.date_report asc`)
        const formattedVio= vio.rows.map((row) => {
            const formattedDate = moment(row.date).format('YYYY-MM-DD');
            return {
                ...row,
                date: formattedDate
            };
        });
        res.json(formattedVio);
    }
}

module.exports = new ViolationsController()