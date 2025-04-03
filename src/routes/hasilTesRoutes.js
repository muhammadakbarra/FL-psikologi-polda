const express = require('express');
const router = express.Router();
const hasilTesController = require('../controllers/hasilTesController');
const auth = require('../middleware/auth');
const excelUpload = require('../config/excelMulterConfig');

// Mengambil semua hasil tes
router.get('/', auth.verifyToken, hasilTesController.getAllHasilTes);

// Mengambil hasil tes berdasarkan filter query (kategoriTesId dan/atau kesatuanId)
router.get('/filter', auth.verifyToken, hasilTesController.getHasilTesByFilter);

// Memperbarui status dan keterangan hasil tes
router.put('/:id', auth.verifyToken, hasilTesController.updateHasilTes);

// Mengambil hasil tes berdasarkan userId
router.get(
    '/user/:userId',
    auth.verifyToken,
    hasilTesController.getHasilTesByUserId
);

// Endpoint baru: Batch update via CSV
router.post(
    '/batch-update',
    auth.verifyToken,
    excelUpload.single('file'), // mengharapkan field "file" di form-data
    hasilTesController.batchUpdateHasilTesFromExcel
);

// delete
router.delete('/:id', auth.verifyToken, hasilTesController.deleteHasilTes);

// template cv
router.get(
    '/generate-template',
    auth.verifyToken,
    hasilTesController.generateTemplateCSV
);
module.exports = router;
