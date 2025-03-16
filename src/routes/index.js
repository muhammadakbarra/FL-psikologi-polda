// src/routes/index.js
const express = require('express');
const userRoutes = require('./userRoutes');
const adminRoutes = require('./adminRoutes');
const authRoutes = require('./authRoutes');
const masterJenisTesRoutes = require('./masterJenisTesRoutes');
const kategoriTesRoutes = require('./kategoriTesRoutes');
const masterKesatuanRoutes = require('./masterKesatuanRoutes');
const masterPangkatRoutes = require('./masterPangkatRoutes');
const mastersRoutes = require('./mastersRoutes');
const biodataRoutes = require('./biodataRoutes');
const soalRoutes = require('./soalRoutes');
const userBiodataRoutes = require('./userBiodataRoutes');
const testSessionRoutes = require('./testSessionRoutes');
const testAnswerRoutes = require('./testAnswerRoutes');
const hasilRoutes = require('./hasilTesRoutes');
const hasilTesExport = require('./hasilTesExportRoutes');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/user-biodata', userBiodataRoutes);
router.use('/admins', adminRoutes);
router.use('/auth', authRoutes);
router.use('/master-jenis-tes', masterJenisTesRoutes);
router.use('/kategori-tes', kategoriTesRoutes);
router.use('/master-kesatuan', masterKesatuanRoutes);
router.use('/master-pangkat', masterPangkatRoutes);
router.use('/masters', mastersRoutes);
router.use('/biodata', biodataRoutes);
router.use('/soal', soalRoutes);
router.use('/test-session', testSessionRoutes);
router.use('/test-answer', testAnswerRoutes);
router.use('/hasil-tes', hasilRoutes);
router.use('/hasil-tes-export', hasilTesExport);
module.exports = router;
