// src/routes/userBiodataRoutes.js
const express = require('express');
const router = express.Router();
const userBiodataController = require('../controllers/userBiodataController');
const auth = require('../middleware/auth');

// GET all (username + biodata)
router.get('/', auth.verifyToken, userBiodataController.getAllUserBiodata);

// GET by ID
router.get('/:id', auth.verifyToken, userBiodataController.getUserBiodataById);

// UPDATE user + biodata
router.put('/:id', auth.verifyToken, userBiodataController.updateUserBiodata);

// DELETE user + biodata
router.delete(
    '/:id',
    auth.verifyToken,
    userBiodataController.deleteUserBiodata
);

module.exports = router;
