// src/routes/testSessionRoutes.js
const express = require('express');
const router = express.Router();
const testSessionController = require('../controllers/testSessionController');
const auth = require('../middleware/auth');

// Membuat session (tanpa startedAt)
router.post('/', auth.verifyToken, testSessionController.createTestSession);

// Memulai session (isi startedAt)
router.put(
    '/:id/start',
    auth.verifyToken,
    testSessionController.startTestSession
);

// Mendapatkan detail session
router.get('/:id', auth.verifyToken, testSessionController.getTestSessionById);

// Menandai session selesai
router.put(
    '/:id/finish',
    auth.verifyToken,
    testSessionController.finishTestSession
);

// Get test categories with completion status for authenticated user
router.get(
    '/user-categories',
    auth.verifyToken,
    testSessionController.getUserTestCategoriesStatus
);

module.exports = router;
