const Router = require('express')
const reportsController = require('../controller/ReportController')
const authToken = require('../authMiddleware')

const router = new Router();
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'image/reports');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

router.get('/reports/admin/:id', authToken, reportsController.getAdminReports);
router.get('/reports/:id', authToken, reportsController.getReports);
router.get('/reports', authToken, reportsController.getAllReports);
// router.get('/reportsAct/:id', authToken, reportsController.createActReports);
router.get('/reportsAct/:id', reportsController.createActReports);
router.delete('/reports/:id', authToken, reportsController.deleteReport);
router.post('/reportsvio', authToken, upload.single('image'), reportsController.createReportsVio);
router.post('/reports', authToken, reportsController.createReports);
// router.patch('/reports/:id', reportsController.updateReports);

module.exports = router


