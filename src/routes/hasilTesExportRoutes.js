const express = require('express');
const router = express.Router();
const hasilTesExportController = require('../controllers/hasilTesExportController');
const auth = require('../middleware/auth');

// Ekspor test results untuk sesi tertentu (Fitur 2)
router.get(
    '/export',
    auth.verifyToken,
    hasilTesExportController.exportTestResults
);

// Ekspor test results konsolidasi untuk semua user berdasarkan filter kategoriTesId dan kesatuanId (Fitur 3)
router.get(
    '/export-all',
    auth.verifyToken,
    hasilTesExportController.exportConsolidatedResults
);

module.exports = router;
