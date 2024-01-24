const Router = require('express')
const userController = require('../controller/UsersController')
const authToken = require('../authMiddleware')
 
const router = new Router();

router.get('/users',  authToken, userController.getUsers);
router.get('/users/image/:id', authToken, userController.getImage);
router.get('/users/:id', authToken, userController.getUser);
router.post('/users/create', authToken, userController.createUsers);
router.patch('/users/:id', authToken, userController.updateUser);

module.exports = router