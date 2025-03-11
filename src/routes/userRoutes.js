const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();

// CRUD endpoints
router.post('/', auth.verifyToken, auth.verifyAdmin, userController.createUser);
router.get('/', auth.verifyToken, auth.verifyAdmin, userController.getAllUsers);
router.get('/:id', auth.verifyToken, userController.getUserById);
router.put('/:id', auth.verifyToken, userController.updateUser);
router.delete('/:id', auth.verifyToken, userController.deleteUser);
// Route untuk batch create users (admin only)
router.post(
    '/batch',
    auth.verifyToken,
    auth.verifyAdmin,
    userController.createBatchUsers
);
// Endpoint baru untuk cek biodata
router.get('/:id/cek-biodata', userController.checkUserBiodata);

module.exports = router;
