const database = require('../db/database')
const moment = require('moment')
class ReportController {

    async getAdminReports(req, res) {
        const id = req.params.id
        const report = await database.query(`SELECT report.id as id, concat(users.firstname, ' ', LEFT(users.secondname, 1), '. ', LEFT(users.lastname, 1), '.') as FIO, typeofviolations.name as violations, objects.name as object, objects.latitude as latitude, objects.longitude as longitude, reportviolations.image as violations_image,  report.date_report as date, report.time_report as time FROM users, report, typeofviolations, reportviolations, objects WHERE report.user_id = users.id AND typeofviolations.id = reportviolations.violations_id AND reportviolations.id = report.rep_vio_id AND objects.id = report.object_id AND report.user_id = users.id AND report.user_id = $1 ORDER BY report.id DESC`, [id])
        const formattedReports = report.rows.map((row) => {
            const formattedDate = moment(row.date).format('YYYY-MM-DD');
            return {
                ...row,
                date: formattedDate
            };
        });
        res.json(formattedReports);
    }

    async getReports(req, res) {
        const id = req.params.id
        const report = await database.query(`SELECT report.id as id, concat(users.firstname, ' ', LEFT(users.secondname, 1), '. ', LEFT(users.lastname, 1), '.') as FIO, typeofviolations.name as violations, objects.name as object, objects.latitude as latitude, objects.longitude as longitude, reportviolations.image as violations_image,  report.date_report as date, report.time_report as time, typeofviolations.description as description FROM users, report, typeofviolations, reportviolations, objects WHERE report.user_id = users.id AND typeofviolations.id = reportviolations.violations_id AND reportviolations.id = report.rep_vio_id AND objects.id = report.object_id AND report.user_id = users.id AND report.id = $1 ORDER BY report.id DESC`, [id])
        const formattedReports = report.rows.map((row) => {
            const formattedDate = moment(row.date).format('YYYY-MM-DD');
            return {
                ...row,
                date: formattedDate
            };
        });
        res.json(formattedReports);
    }


    async getAllReports(req, res) {
        const report = await database.query(`SELECT report.id as id, concat(users.firstname, ' ', LEFT(users.secondname, 1), '. ', LEFT(users.lastname, 1), '.') as FIO, typeofviolations.name as violations, objects.name as object, objects.latitude as latitude, objects.longitude as longitude, reportviolations.image as violations_image,  report.date_report as date, report.time_report as time FROM users, report, typeofviolations, reportviolations, objects WHERE report.user_id = users.id AND typeofviolations.id = reportviolations.violations_id AND reportviolations.id = report.rep_vio_id AND objects.id = report.object_id AND report.object_id = objects.id ORDER BY report.id DESC`)
        const formattedReports = report.rows.map((row) => {
            const formattedDate = moment(row.date).format('YYYY-MM-DD');
            return {
                ...row,
                date: formattedDate
            };
        });
        res.json(formattedReports);

    }

    async createReportsVio(req, res) {
        const {user_id, violations_id} = req.body;
        const imageName = req.file.originalname;
        console.log(user_id + violations_id)
        try {
            const newReportVio = await database.query(`insert into ReportViolations(user_id, violations_id, image) values($1, $2, $3) RETURNING *`, [user_id, violations_id, imageName])
            res.json(newReportVio.rows[0])
        } catch (error) {
            res.json({
                message: "Во время создания произошла ошибка"
            })
        }
    }

    async createReports(req, res) {
        const {user_id, rep_vio_id, object_id} = req.body;

        try {
            const report = await database.query(`insert into report(user_id, rep_vio_id, object_id, date_report, time_report) values($1, $2, $3, current_date, current_time) RETURNING *`, [user_id, rep_vio_id, object_id])
            // res.json(report.rows[0])
            const responseData = report.rows[0];
            const formattedDate = moment(responseData.date_report).format()
            responseData.date_report = formattedDate;
            res.json(responseData);
        } catch (error) {
            res.json({
                message: "Во время создания произошла ошибка"
            })
        }
    }


}

module.exports = new ReportController()