const Router = require('express')
const objectsController = require('../controller/ObjectsController')
const router = new Router();

router.get('/objects', objectsController.getAllObjects);
router.get('/objects/{id}', objectsController.getObjects);
router.post('/objects', objectsController.createObject);
router.patch('/objects/{id}', objectsController.updateObjects);

module.exports = router