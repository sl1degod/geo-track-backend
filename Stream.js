const fs = require("fs");
class Stream {


    usersReadStream(req, res, id) {
        try {
            res.writeHead(200, {'Content-Type': 'image/jpeg'})
            fs.createReadStream(`image/users/${id}.jpg`).pipe(res);
        } catch (error) {
            res.json({
                "message": "Произошла ошибка"
            })
        }
    }

    objectsReadStream(req, res, id) {
        try {
            res.writeHead(200, {'Content-Type': 'image/jpeg'})
            fs.createReadStream(`image/objects/${id}.jpg`).pipe(res);
        } catch (error) {
            res.json({
                "message": "Произошла ошибка"
            })
        }
    }
}

module.exports = new Stream()