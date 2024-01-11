const Router = require('express')
const reportsController = require('../controller/ReportController')
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

router.get('/reports/admin/:id', reportsController.getAdminReports);
router.get('/reports/:id', reportsController.getReports);
router.get('/reports', reportsController.getAllReports);
router.post('/reportsvio', upload.single('image'), reportsController.createReportsVio);
router.post('/reports', reportsController.createReports);
// router.patch('/reports/:id', reportsController.updateReports);

module.exports = router


