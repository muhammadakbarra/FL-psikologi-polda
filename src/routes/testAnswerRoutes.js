// src/routes/testAnswerRoutes.js
const express = require('express');
const router = express.Router();
const testAnswerController = require('../controllers/testAnswerController');
const auth = require('../middleware/auth');

// Membuat jawaban
router.post('/', auth.verifyToken, testAnswerController.createUserAnswer);

// Update jawaban
router.put('/:id', auth.verifyToken, testAnswerController.updateUserAnswer);

// Mendapatkan semua jawaban dalam satu session
router.get(
    '/session/:sessionId',
    auth.verifyToken,
    testAnswerController.getAnswersBySession
);

module.exports = router;
