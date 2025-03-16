const express = require('express');
const router = express.Router();
const hasilTesController = require('../controllers/hasilTesController');
const auth = require('../middleware/auth');

router.get('/', auth.verifyToken, hasilTesController.getAllHasilTes);

router.put('/:id', auth.verifyToken, hasilTesController.updateHasilTes);

module.exports = router;
