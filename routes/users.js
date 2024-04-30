const Router = require('express')
const userController = require('../controller/UsersController')
const authToken = require('../authMiddleware')
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'image/users');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });
const router = new Router();

router.get('/users',  authToken, userController.getUsers);
router.get('/users/image/:id', authToken, userController.getImage);
router.get('/users/:id', authToken, userController.getUser);
router.post('/users', authToken, upload.single('uuid_image'), userController.createUsers);
router.put('/users/:id', authToken, userController.updateUser);

module.exports = router