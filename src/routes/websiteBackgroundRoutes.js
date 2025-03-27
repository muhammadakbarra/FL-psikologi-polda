// src/routes/websiteBackgroundRoutes.js
const express = require('express');
const router = express.Router();
const backgroundController = require('../controllers/websiteBackgroundController');
const upload = require('../config/multerConfig');
const auth = require('../middleware/auth'); // Import auth middleware yang benar

// Dapatkan background aktif (public API)
router.get('/', backgroundController.getBackground);

// Serve background image file (public)
router.get('/image', backgroundController.serveBackgroundImage);

// Update background (admin only)
// Gunakan middleware yang sudah ada: verifyToken untuk autentikasi dan verifyAdmin untuk memastikan role
router.post(
    '/update',
    auth.verifyToken, // Periksa token terlebih dahulu
    auth.verifyAdmin, // Kemudian pastikan user adalah admin
    upload.single('background'),
    backgroundController.updateBackground
);

module.exports = router;
