const Router = require('express')
const violationsController = require('../controller/ViolationsController')
const authToken = require('../authMiddleware')

const router = new Router();

router.get('/violations', authToken, violationsController.getAllViolations);
router.get('/violationsChar', authToken, violationsController.getCharViolations);
router.get('/objectsChar', authToken, violationsController.getCharObjects);
router.get('/violations/:id', authToken, violationsController.getViolations);

module.exports = router

