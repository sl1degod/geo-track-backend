const database = require('../db/database')

class ReportController {

    async getAllReports(req, res) {

        const report = await database.query(`select concat(users.firstname, ' ', secondname, ' ', lastname) as FIO, typeofviolations.name, reportviolations.image from users, report, typeofviolations, reportviolations where report.user_id = users.id and typeofviolations.id = reportviolations.violations_id and reportviolations.id = report.rep_vio_id`)
        res.json(report.rows)
    }

    async getReports(req, res) {
        const id = req.params.id
        const report = await database.query(`select concat(users.firstname, \' \', users.secondname, \' \', users.lastname) as FIO, typeofviolations.name, reportviolations.image from users, report, typeofviolations, reportviolations where report.id = $1 and report.user_id = users.id and typeofviolations.id = reportviolations.violations_id and reportviolations.id = report.rep_vio_id`, [id])
        res.json(report.rows[0])
    }

    async createReportsVio(req, res) {
        const {user_id, violations_id, image} = req.body;

        try {
            const newReportVio = await database.query(`insert into ReportViolations(user_id, violations_id, image) values($1, $2, $3) RETURNING *`, [user_id, violations_id, image])
            res.json(newReportVio.rows[0])
        } catch (error) {
            res.json({
                message: "Во время создания плейлиста произошла ошибка"
            })
        }
    }

    async createReports(req, res) {
        const {user_id, rep_vio_id, object_id} = req.body;

        try {
            const report = await database.query(`insert into report(user_id, rep_vio_id, object_id) values($1, $2, $3) RETURNING *`, [user_id, rep_vio_id, object_id])
            res.json(report.rows[0])

        } catch (error) {
            res.json({
                message: "Во время создания плейлиста произошла ошибка"
            })
        }
    }



    async updateReports(req, res) {

    }
}

module.exports = new ReportController()