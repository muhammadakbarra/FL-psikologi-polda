const express = require('express');
const router = express.Router();
const mastersController = require('../controllers/mastersController');
const auth = require('../middleware/auth');

// Endpoint yang sudah ada: Mengambil data kesatuan (berdasarkan user login) dan pangkat
router.get(
    '/kesatuan-pangkat',
    auth.verifyToken,
    mastersController.getAllMastersKesatuanPangkat
);

// API baru: Total jumlah user
router.get(
    '/user-count',
    auth.verifyToken,
    mastersController.getTotalUserCount
);

// API baru: Total user berdasarkan kesatuan menggunakan parameter :kesatuanId
router.get(
    '/user-count-by-kesatuan/:kesatuanId',
    auth.verifyToken,
    mastersController.getUserCountByKesatuan
);

module.exports = router;
