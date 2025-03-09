const express = require('express');
const router = express.Router();
const mastersController = require('../controllers/mastersController');
const auth = require('../middleware/auth');

router.get(
    '/kesatuan-pangkat',
    auth.verifyToken,
    mastersController.getAllMastersKesatuanPangkat
);

module.exports = router;
