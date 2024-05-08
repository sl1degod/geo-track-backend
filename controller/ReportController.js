const database = require('../db/database')
const moment = require('moment')
const docx = require('docx-templates');
const fs = require('fs')
const nodemailer = require("nodemailer");

class ReportController {

    async getAdminReports(req, res) {
        const id = req.params.id
        const report = await database.query(`SELECT report.id as id, concat(users.firstname, ' ', LEFT(users.secondname, 1), '. ', LEFT(users.lastname, 1), '.') as FIO, typeofviolations.name as violations, objects.name as object, objects.latitude as latitude, objects.longitude as longitude, reportviolations.image as violations_image,  report.date_report as date, report.time_report as time, report.description as description FROM users, report, typeofviolations, reportviolations, objects WHERE report.user_id = users.id AND typeofviolations.id = reportviolations.violations_id AND reportviolations.id = report.rep_vio_id AND objects.id = report.object_id AND report.user_id = users.id AND report.user_id = $1 ORDER BY report.id DESC`, [id])
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
        const report = await database.query(`SELECT report.id as id, concat(users.firstname, ' ', LEFT(users.secondname, 1), '. ', LEFT(users.lastname, 1), '.') as FIO, typeofviolations.name as violations, objects.name as object, objects.latitude as latitude, objects.longitude as longitude, report.latitude as rep_latitude, report.longitude as rep_longitude, reportviolations.image as violations_image,  report.date_report as date, report.time_report as time, report.description as description FROM users, report, typeofviolations, reportviolations, objects WHERE report.user_id = users.id AND typeofviolations.id = reportviolations.violations_id AND reportviolations.id = report.rep_vio_id AND objects.id = report.object_id AND report.user_id = users.id AND report.id = $1`, [id])
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
        const report = await database.query(`SELECT report.id as id, concat(users.firstname, ' ', LEFT(users.secondname, 1), '. ', LEFT(users.lastname, 1), '.') as FIO, typeofviolations.name as violations, objects.name as object, objects.latitude as latitude, objects.longitude as longitude, report.latitude as rep_latitude, report.longitude as rep_longitude, reportviolations.image as violations_image,  report.date_report as date, report.time_report as time, report.description as description FROM users, report, typeofviolations, reportviolations, objects WHERE report.user_id = users.id AND typeofviolations.id = reportviolations.violations_id AND reportviolations.id = report.rep_vio_id AND objects.id = report.object_id AND report.object_id = objects.id ORDER BY report.id DESC`)
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
        const {user_id, rep_vio_id, object_id, latitude, longitude, description} = req.body;
        try {
            const report = await database.query(`insert into report(user_id, rep_vio_id, object_id, date_report, time_report, latitude, longitude, description) values($1, $2, $3, current_date, current_time, $4, $5, $6) RETURNING *`, [user_id, rep_vio_id, object_id, latitude, longitude, description])
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

    async createActReports(req, res) {
        const id = req.params.id
        try {
            const report = await database.query(`SELECT report.id as id, concat(users.firstname, ' ', LEFT(users.secondname, 1), '. ', LEFT(users.lastname, 1), '.') as FIO, typeofviolations.name as violations, objects.name as object, objects.latitude as latitude, objects.longitude as longitude, reportviolations.image as image,  report.date_report as date, report.time_report as time, report.description as description FROM users, report, typeofviolations, reportviolations, objects WHERE report.user_id = users.id AND typeofviolations.id = reportviolations.violations_id AND reportviolations.id = report.rep_vio_id AND objects.id = report.object_id AND report.object_id = objects.id and report.id = $1`, [id])
            const responseData = report.rows[0];
            const formattedDate = moment(responseData.date_report).format()
            responseData.date_report = formattedDate;
            const template = fs.readFileSync('act.docx');
            const image = fs.readFileSync('./image/reports/' + responseData.image);
            const reportAct = await docx.createReport({
                template,
                data: {
                    id: responseData.id,
                    fio: responseData.fio,
                    violations: responseData.violations,
                    object: responseData.object,
                    reportDate: responseData.date_report.slice(0, 10),
                    latitude: responseData.latitude.slice(0,6),
                    longitude: responseData.longitude.slice(0,6),
                    imageNumber: responseData.image,
                    description: responseData.description,
                    image: image
                },
                // +++IMAGE pasteImage()+++
                cmdDelimiter: ['+++', '+++'],
                additionalJsContext: {
                    pasteImage: () => {
                        const data = image;
                        return { width: 10, height: 10, data, extension: '.jpeg' };
                    }
                }
            });

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            res.end(new Buffer(reportAct, 'base64'));

        } catch (error) {
            res.json({
                message: error.message
            })
        }
    }

    async sendEmail(req, res) {
        const id = req.params.id
        const {email} = req.body
        try {
            const report = await database.query(`SELECT report.id as id, concat(users.firstname, ' ', LEFT(users.secondname, 1), '. ', LEFT(users.lastname, 1), '.') as FIO, typeofviolations.name as violations, objects.name as object, objects.latitude as latitude, objects.longitude as longitude, reportviolations.image as image,  report.date_report as date, report.description as description FROM users, report, typeofviolations, reportviolations, objects WHERE report.user_id = users.id AND typeofviolations.id = reportviolations.violations_id AND reportviolations.id = report.rep_vio_id AND objects.id = report.object_id AND report.object_id = objects.id and report.id = $1`, [id])
            const responseData = report.rows[0];
            responseData.date = moment(responseData.date).format();
            const template = fs.readFileSync('act.docx');
            const image = fs.readFileSync('./image/reports/' + responseData.image);
            const reportAct = await docx.createReport({
                template,
                data: {
                    id: responseData.id,
                    fio: responseData.fio,
                    violations: responseData.violations,
                    object: responseData.object,
                    reportDate: responseData.date.slice(0, 10),
                    latitude: responseData.latitude.slice(0,6),
                    longitude: responseData.longitude.slice(0,6),
                    imageNumber: responseData.image,
                    description: responseData.description,
                    image: image
                },
                // +++IMAGE pasteImage()+++
                cmdDelimiter: ['+++', '+++'],
                additionalJsContext: {
                    pasteImage: () => {
                        const data = image;
                        return { width: 10, height: 10, data, extension: '.jpeg' };
                    }
                }
            });

            const transporter = nodemailer.createTransport({
                host: "smtp.mail.ru",
                port: 465,
                secure: true,
                auth: {
                    user: "ilyas2701@mail.ru",
                    pass: "LfKY5NtEtMzDvXpVhsrH",
                },
            });

            let mailOptions = {
                from: 'ilyas2701@mail.ru',
                to: email,
                subject: 'Отчет об нарушениях',
                text: 'Пожалуйста, найдите прикрепленный отчет об нарушениях.',
                attachments: [
                    {
                        filename: 'report.docx',
                        content: reportAct
                    }
                ]
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Ошибка при отправке почты:', error);
                    res.status(500).send('Ошибка при отправке почты');
                } else {
                    console.log('Письмо успешно отправлено:', info.response);
                    res.json({message: "Отчет успешно отправлен на указанный адрес."});
                }
            });


        } catch (error) {
            res.json({
                message: error.message
            });
        }
    }


    async deleteReport(req, res) {
        const id = req.params.id
        const report = await database.query('delete from report where id = $1', [id])
        res.json("Удаление прошло успешно");
    }


}

module.exports = new ReportController()