const express = require('express');
const router = express.Router();
const masterKesatuanController = require('../controllers/masterKesatuanController');
const auth = require('../middleware/auth'); // jika ingin proteksi endpoint

// Create Master Kesatuan
router.post(
    '/',
    auth.verifyToken,
    masterKesatuanController.createMasterKesatuan
);

// Get All Master Kesatuan
router.get(
    '/',
    // auth.verifyToken,
    masterKesatuanController.getAllMasterKesatuan
);

// Delete Master Kesatuan by ID
router.delete(
    '/:id',
    auth.verifyToken,
    masterKesatuanController.deleteMasterKesatuanById
);

module.exports = router;
