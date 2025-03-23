// src/config/excelMulterConfig.js
const multer = require('multer');
const path = require('path');

// Batasi ukuran file, misalnya max 10 MB
const limits = {
    fileSize: 10 * 1024 * 1024, // 10 MB
};

// Filter file khusus untuk Excel
function fileFilter(req, file, cb) {
    // Daftar MIME type untuk file Excel
    const excelMimeTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/octet-stream',
    ];

    // Periksa extension file
    const ext = path.extname(file.originalname).toLowerCase();
    const validExt = ['.xlsx', '.xls', '.csv'].includes(ext);

    if (excelMimeTypes.includes(file.mimetype) || validExt) {
        cb(null, true);
    } else {
        cb(
            new Error('Hanya file Excel yang diperbolehkan (.xlsx atau .xls)!'),
            false
        );
    }
}

// Gunakan memory storage untuk memproses file Excel
const storage = multer.memoryStorage();

const uploadExcel = multer({
    storage,
    fileFilter,
    limits,
});

module.exports = uploadExcel;
