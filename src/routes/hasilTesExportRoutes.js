const express = require('express');
const router = express.Router();
const hasilTesExportController = require('../controllers/hasilTesExportController');
const auth = require('../middleware/auth');

// Export untuk sesi tertentu (Fitur 2)
router.get(
    '/export',
    auth.verifyToken,
    hasilTesExportController.exportTestResults
);

// Export hasil konsolidasi untuk semua user (Fitur 3)
router.get(
    '/export-all',
    auth.verifyToken,
    hasilTesExportController.exportConsolidatedResults
);

module.exports = router;
