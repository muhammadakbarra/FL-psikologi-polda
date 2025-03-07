const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Login terpadu (cek admin dulu, kemudian user)
router.post('/login', authController.login);

module.exports = router;
