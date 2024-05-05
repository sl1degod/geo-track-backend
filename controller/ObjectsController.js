const db = require('../db/database')
const database = require("../db/database");
const stream = require('../Stream')

class ObjectsController {

    async getAllObjects(req, res) {
        const objects = await database.query('SELECT objects.id, objects.name, objects.latitude, objects.longitude, objects.uuid_image, concat(users.firstname, \' \', LEFT(users.secondname, 1), \'. \', LEFT(users.lastname, 1), \'.\') as FIO, count (report.object_id) as count FROM objects LEFT JOIN report ON objects.id = report.object_id LEFT JOIN users ON objects.admin = users.id GROUP BY objects.id, objects.name, objects.latitude, objects.longitude, objects.uuid_image, fio order by objects.id desc')
        res.json(objects.rows)
    }

    async getObjects(req, res) {
        const id = req.params.id
        const objects = await database.query('select * from objects where id = $1', [id])
        res.json(objects.rows[0])
    }

    async getImage(req, res) {
        const id = req.params.id
        const user = await database.query('select users.firstname, users.secondname, users.lastname, users.uuid_image, posts.name as post, users.login, users.password from users, posts where users.post_id = posts.id and users.id = $1', [id])
        stream.objectsReadStream(req, res, id)
    }

    async createObject(req, res) {
        const {name, latitude, longitude, admin} = req.body;
        const imageName = req.file.originalname;
        try {
            const newObject = await database.query(`insert into objects (name, latitude, longitude, uuid_image, admin) values($1, $2, $3, $5, $4) RETURNING *`, [name, latitude, longitude, admin, imageName])
            res.json(newObject.rows[0])
        } catch (error) { 
            res.json({  
                message: "Во время создания объекта произошла ошибка"
            })
        }
        console.log(imageName); 
    }

    async updateObjects(req, res) {
        const id = req.params.id
        const {name, latitude, longitude, admin} = req.body;
        await database.query('update objects set name = $1, latitude = $2, longitude = $3, admin = $4 where id = $5', [name, latitude, longitude, admin, id])
        res.json("all okey")
    }

}

module.exports = new ObjectsController()