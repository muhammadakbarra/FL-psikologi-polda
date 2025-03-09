const express = require('express');
const router = express.Router();
const masterJenisTesController = require('../controllers/masterJenisTesController');
const auth = require('../middleware/auth'); // Gunakan proteksi jika diperlukan

// Endpoint untuk membuat data baru
router.post(
    '/',
    auth.verifyToken,
    masterJenisTesController.createMasterJenisTes
);

// Endpoint untuk mendapatkan semua data
router.get(
    '/',
    // auth.verifyToken,
    masterJenisTesController.getAllMasterJenisTes
);

// Endpoint untuk menghapus berdasarkan id
router.delete(
    '/:id',
    auth.verifyToken,
    masterJenisTesController.deleteMasterJenisTesById
);

module.exports = router;
