const express = require('express');
const userRoutes = require('./userRoutes');
const adminRoutes = require('./adminRoutes');
const authRoutes = require('./authRoutes');
const masterJenisTesRoutes = require('./masterJenisTesRoutes');
const kategoriTesRoutes = require('./kategoriTesRoutes');
const masterKesatuanRoutes = require('./masterKesatuanRoutes'); // route baru
const masterPangkatRoutes = require('./masterPangkatRoutes'); // route baru

const router = express.Router();

router.use('/users', userRoutes);
router.use('/admins', adminRoutes);
router.use('/auth', authRoutes);
router.use('/master-jenis-tes', masterJenisTesRoutes);
router.use('/kategori-tes', kategoriTesRoutes);
router.use('/master-kesatuan', masterKesatuanRoutes); // daftarkan route
router.use('/master-pangkat', masterPangkatRoutes); // daftarkan route

module.exports = router;
