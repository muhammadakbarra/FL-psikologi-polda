const express = require('express');
const router = express.Router();
const hasilTesController = require('../controllers/hasilTesController');
const auth = require('../middleware/auth');

// Mengambil semua hasil tes
router.get('/', auth.verifyToken, hasilTesController.getAllHasilTes);

// Mengambil hasil tes berdasarkan filter query (kategoriTesId dan/atau kesatuanId)
router.get('/filter', auth.verifyToken, hasilTesController.getHasilTesByFilter);

// Memperbarui status dan keterangan hasil tes
router.put('/:id', auth.verifyToken, hasilTesController.updateHasilTes);

module.exports = router;
