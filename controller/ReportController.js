const database = require('../db/database')
const fs = require('fs');

class ReportController {

    async getAllReports(req, res) {
        const report = await database.query(`select report.id as id, concat(users.firstname, ' ', LEFT(users.secondname, 1), '. ', LEFT(users.lastname, 1), '.') as FIO, typeofviolations.name as violations, objects.name as objects, objects.latitude as latitude, objects.longitude as longitude, reportviolations.image as violations_image from users, report, typeofviolations, reportviolations, objects where report.user_id = users.id and typeofviolations.id = reportviolations.violations_id and reportviolations.id = report.rep_vio_id and objects.id = report.object_id`)
        res.json(report.rows)
    }

    async getReports(req, res) {
        const id = req.params.id
        const report = await database.query(`select concat(users.firstname, \' \', users.secondname, \' \', users.lastname) as FIO, typeofviolations.name, reportviolations.image from users, report, typeofviolations, reportviolations where report.id = $1 and report.user_id = users.id and typeofviolations.id = reportviolations.violations_id and reportviolations.id = report.rep_vio_id`, [id])
        res.json(report.rows[0])
    }

    async createReportsVio(req, res) {
        const {user_id, violations_id} = req.body;
        const imageName = req.file.originalname;
        const image = req.file.originalname;

        try {
            const newReportVio = await database.query(`insert into ReportViolations(user_id, violations_id, image) values($1, $2, $3) RETURNING *`, [user_id, violations_id, imageName])
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


}

module.exports = new ReportController()