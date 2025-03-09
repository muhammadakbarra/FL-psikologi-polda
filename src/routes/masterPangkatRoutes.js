const express = require('express');
const router = express.Router();
const masterPangkatController = require('../controllers/masterPangkatController');
const auth = require('../middleware/auth'); // jika ingin proteksi endpoint

// Create Master Pangkat
router.post('/', auth.verifyToken, masterPangkatController.createMasterPangkat);

// Get All Master Pangkat
router.get('/', auth.verifyToken, masterPangkatController.getAllMasterPangkat);

// Delete Master Pangkat by ID
router.delete(
    '/:id',
    auth.verifyToken,
    masterPangkatController.deleteMasterPangkatById
);

module.exports = router;
