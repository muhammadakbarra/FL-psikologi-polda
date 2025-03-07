const express = require('express');
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');

const router = express.Router();

// CRUD endpoints
router.post(
    '/',
    auth.verifyToken,
    auth.verifySuperAdmin,
    adminController.createAdmin
);
router.get(
    '/',
    auth.verifyToken,
    auth.verifySuperAdmin,
    adminController.getAllAdmins
);
router.get(
    '/:id',
    auth.verifyToken,
    auth.verifyAdmin,
    adminController.getAdminById
);
router.put(
    '/:id',
    auth.verifyToken,
    auth.verifyAdmin,
    adminController.updateAdmin
);
router.delete(
    '/:id',
    auth.verifyToken,
    auth.verifySuperAdmin,
    adminController.deleteAdmin
);

module.exports = router;
