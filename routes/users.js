const Router = require('express')
const userController = require('../controller/UsersController')
const router = new Router();

router.get('/users', userController.getUsers);
router.get('/users/image/:id',  userController.getImage);
router.get('/users/:id', userController.getUser);
router.post('/users/create', userController.createUsers);
router.patch('/users/:id', userController.updateUser);

module.exports = router