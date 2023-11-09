const Router = require('express')
const reportsController = require('../controller/ReportController')
const router = new Router();
const multer = require('multer');
const upload = multer({ dest: 'image/' });

router.get('/reports', reportsController.getAllReports);
router.get('/reports/:id', reportsController.getReports);
router.post('/reportsvio', upload.single('image'), reportsController.createReportsVio);
router.post('/reports', reportsController.createReports);
// router.patch('/reports/:id', reportsController.updateReports);

module.exports = router


