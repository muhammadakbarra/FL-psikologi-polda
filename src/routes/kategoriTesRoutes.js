const express = require('express');
const router = express.Router();
const kategoriTesController = require('../controllers/kategoriTesController');
const auth = require('../middleware/auth'); // endpoint dilindungi, gunakan verifikasi token

// Endpoint untuk membuat kategori tes
router.post('/', auth.verifyToken, kategoriTesController.createKategoriTes);

// Endpoint untuk mendapatkan semua kategori tes
router.get('/', auth.verifyToken, kategoriTesController.getAllKategoriTes);

// Endpoint untuk menghapus kategori tes berdasarkan ID
router.delete(
    '/:id',
    auth.verifyToken,
    kategoriTesController.deleteKategoriTesById
);

module.exports = router;
