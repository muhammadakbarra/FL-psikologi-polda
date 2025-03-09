const express = require('express');
const router = express.Router();
const biodataController = require('../controllers/biodataController');
const auth = require('../middleware/auth');

// Buat biodata baru
router.post('/', auth.verifyToken, biodataController.createBiodata);

// Lihat detail biodata (opsional, jika dibutuhkan)
router.get('/:id', auth.verifyToken, biodataController.getBiodataById);

module.exports = router;
