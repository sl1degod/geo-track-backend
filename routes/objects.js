const Router = require('express')
const objectsController = require('../controller/ObjectsController')
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

router.get('/objects', objectsController.getAllObjects);
router.get('/objects/:id', objectsController.getObjects);
router.get('/objects/image/:id', objectsController.getImage);
router.post('/objects', upload.single('uuid_image'), objectsController.createObject);
router.patch('/objects/:id', objectsController.updateObjects);

module.exports = router 