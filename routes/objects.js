const Router = require('express')
const objectsController = require('../controller/ObjectsController')
const authToken = require('../authMiddleware')

const router = new Router();
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'image/objects');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

router.get('/objects', authToken, objectsController.getAllObjects);
router.get('/objects/:id', authToken, objectsController.getObjects);
router.get('/objects/image/:id', authToken, objectsController.getImage);
router.post('/objects', authToken, upload.single('uuid_image'), objectsController.createObject);
router.patch('/objects/:id', authToken, objectsController.updateObjects);

module.exports = router 