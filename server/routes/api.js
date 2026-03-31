const express = require('express');
const multer = require('multer');
const router = express.Router();
const reportController = require('../controllers/reportController');

const upload = multer({ dest: 'uploads/' });

router.post('/generate-ddr', upload.fields([
  { name: 'inspectionReport', maxCount: 1 },
  { name: 'thermalReport', maxCount: 1 }
]), reportController.generateDDR);

module.exports = router;
