const Router = require('express')
const authController = require('../controller/AuthController')
const router = new Router();

router.post('/login', authController.login);

module.exports = router 