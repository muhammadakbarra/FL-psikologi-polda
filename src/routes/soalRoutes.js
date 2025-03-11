// src/routes/soalRoutes.js
const express = require('express');
const router = express.Router();
const soalController = require('../controllers/soalController');
const auth = require('../middleware/auth'); // opsional
const upload = require('../config/multerConfig'); // import config multer

// CREATE soal (dengan upload gambar opsional)
router.post(
    '/',
    auth.verifyToken,
    upload.single('gambar_soal'),
    soalController.createSoal
);

// GET all soal
router.get('/', auth.verifyToken, soalController.getAllSoal);

// GET all soal by kategoriTesId
router.get(
    '/kategori/:kategoriTesId',
    auth.verifyToken,
    soalController.getSoalByKategori
);

// GET soal by ID
router.get('/:id', auth.verifyToken, soalController.getSoalById);

// UPDATE soal (dengan upload gambar opsional)
router.put(
    '/:id',
    auth.verifyToken,
    upload.single('gambar_soal'),
    soalController.updateSoal
);

// DELETE soal
router.delete('/:id', auth.verifyToken, soalController.deleteSoal);

module.exports = router;
