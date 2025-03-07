const express = require('express');
const userRoutes = require('./userRoutes');
const adminRoutes = require('./adminRoutes');
const authRoutes = require('./authRoutes');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/admins', adminRoutes);
router.use('/auth', authRoutes);

module.exports = router;
