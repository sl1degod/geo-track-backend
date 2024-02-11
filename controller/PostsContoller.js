const database = require("../db/database");
class PostsController {
    async getPosts(req, res) {
        const posts = await database.query('select * from posts')
        res.json(posts.rows)
    }
}
module.exports = new PostsController()