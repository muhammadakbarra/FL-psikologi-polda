// src/config/multerConfig.js
const multer = require('multer');

// Batasi ukuran file, misalnya max 10 MB
const limits = {
    fileSize: 10 * 1024 * 1024, // 10 MB
};

// Filter file agar hanya menerima tipe image
function fileFilter(req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
    }
}

// Gunakan memory storage agar file bisa diproses oleh Sharp sebelum disimpan
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    fileFilter,
    limits,
});

module.exports = upload;
