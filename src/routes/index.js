const express = require('express');
const userRoutes = require('./userRoutes');
const adminRoutes = require('./adminRoutes');
const authRoutes = require('./authRoutes');
const masterJenisTesRoutes = require('./masterJenisTesRoutes');
const kategoriTesRoutes = require('./kategoriTesRoutes'); // import route kategori tes

const router = express.Router();

router.use('/users', userRoutes);
router.use('/admins', adminRoutes);
router.use('/auth', authRoutes);
router.use('/master-jenis-tes', masterJenisTesRoutes);
router.use('/kategori-tes', kategoriTesRoutes); // daftarkan route kategori tes

module.exports = router;
