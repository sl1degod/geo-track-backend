const Router = require('express')
const postsController = require('../controller/PostsContoller')
const authToken = require('../authMiddleware')

const router = new Router();

router.get('/posts', authToken, postsController.getPosts);


module.exports = router

