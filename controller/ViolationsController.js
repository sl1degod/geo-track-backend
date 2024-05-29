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
        const vio = await database.query(`SELECT 
    report.date_report AS date, 
    COUNT(report.object_id) AS count 
FROM 
    report 
LEFT JOIN 
    reportviolations ON reportviolations.id = report.rep_vio_id 
LEFT JOIN 
    typeofviolations ON typeofviolations.id = reportviolations.violations_id 
GROUP BY 
    report.date_report 
ORDER BY 
    report.date_report ASC;
`)
        const formattedVio= vio.rows.map((row) => {
            const formattedDate = moment(row.date).format('YYYY-MM-DD');
            return {
                ...row,
                date: formattedDate
            };
        });
        res.json(formattedVio);
    }

    async getCharObjects(req, res) {
        const vio = await database.query(`SELECT
        o.name AS object_name,
            COUNT(r.id) AS violation_count
        FROM
        Report r
        JOIN
        Objects o ON r.object_id = o.id
        JOIN
        ReportViolations rv ON r.rep_vio_id = rv.id
        JOIN
        TypeOfViolations tv ON rv.violations_id = tv.id
        GROUP BY
        o.name
        ORDER BY
        violation_count DESC;
        `)
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