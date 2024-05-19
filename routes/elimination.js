const Router = require('express')
const eliminationController = require('../controller/ElliminationContoller')
const authToken = require('../authMiddleware')

const router = new Router();

router.get('/elimination', authToken, eliminationController.getAllEliminations);

module.exports = router

