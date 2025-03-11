// src/controllers/soalController.js
const soalService = require('../services/soalService');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Helper untuk membuat folder dan menyimpan gambar dengan kompresi (jika > 2MB)
async function simpanFileGambar(file) {
    const originalSize = file.size;
    const uploadDir = path.join(__dirname, '../../storage/gambar-soal');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const timestamp = Date.now();
    const ext = path.extname(file.originalname) || '.jpg';
    const fileName = `soal-${timestamp}${ext}`;
    const outputPath = path.join(uploadDir, fileName);

    // Kompres jika > 2 MB
    if (originalSize > 2 * 1024 * 1024) {
        await sharp(file.buffer)
            .resize({ width: 1200, fit: 'inside' })
            .jpeg({ quality: 80 })
            .toFile(outputPath);
    } else {
        // Jika <= 2MB, tetap bisa simpan langsung (atau tetap kompres agar format konsisten)
        await sharp(file.buffer).toFile(outputPath);
    }

    return `storage/gambar-soal/${fileName}`;
}

const createSoal = async (req, res) => {
    try {
        const { kategoriTesId, teks_soal } = req.body;

        // Pastikan kategoriTesId terisi, karena kita butuh mengaitkan ke KategoriTes
        if (!kategoriTesId) {
            return res.status(400).json({
                status: 'error',
                message: 'kategoriTesId harus diisi',
            });
        }

        // Tangani pilihanJawaban (bisa array atau string JSON)
        let pilihanJawaban = [];
        if (req.body.pilihanJawaban) {
            if (typeof req.body.pilihanJawaban === 'string') {
                pilihanJawaban = JSON.parse(req.body.pilihanJawaban);
            } else {
                pilihanJawaban = req.body.pilihanJawaban;
            }
        }

        // Default gambar_soal = null
        let gambar_soal = null;
        if (req.file) {
            // Ada file gambar yang diupload
            gambar_soal = await simpanFileGambar(req.file);
        }

        const newSoal = await soalService.createSoal({
            kategoriTesId: parseInt(kategoriTesId),
            teks_soal: teks_soal || null, // Boleh null
            gambar_soal,
            pilihanJawaban,
        });

        return res.status(201).json({
            status: 'success',
            message: 'Soal berhasil dibuat',
            data: newSoal,
        });
    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: error.message || 'Gagal membuat soal',
        });
    }
};

const getAllSoal = async (req, res) => {
    try {
        const soalList = await soalService.getAllSoal();
        return res.status(200).json({
            status: 'success',
            data: soalList,
        });
    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: error.message || 'Gagal mendapatkan data soal',
        });
    }
};

const getSoalById = async (req, res) => {
    try {
        const { id } = req.params;
        const soal = await soalService.getSoalById(parseInt(id));
        if (!soal) {
            return res.status(404).json({
                status: 'error',
                message: 'Soal tidak ditemukan',
            });
        }
        return res.status(200).json({
            status: 'success',
            data: soal,
        });
    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: error.message || 'Gagal mendapatkan data soal',
        });
    }
};

const updateSoal = async (req, res) => {
    try {
        const { id } = req.params;
        const { teks_soal } = req.body; // Boleh null

        // Tangani pilihanJawaban
        let pilihanJawaban = [];
        if (req.body.pilihanJawaban) {
            if (typeof req.body.pilihanJawaban === 'string') {
                pilihanJawaban = JSON.parse(req.body.pilihanJawaban);
            } else {
                pilihanJawaban = req.body.pilihanJawaban;
            }
        }

        let gambar_soal = null;
        if (req.file) {
            gambar_soal = await simpanFileGambar(req.file);
        }

        const updated = await soalService.updateSoal(parseInt(id), {
            teks_soal: teks_soal || null,
            gambar_soal,
            pilihanJawaban,
        });

        return res.status(200).json({
            status: 'success',
            message: 'Soal berhasil diperbarui',
            data: updated,
        });
    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: error.message || 'Gagal memperbarui soal',
        });
    }
};

const deleteSoal = async (req, res) => {
    try {
        const { id } = req.params;
        await soalService.deleteSoal(parseInt(id));
        return res.status(200).json({
            status: 'success',
            message: 'Soal berhasil dihapus',
        });
    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: error.message || 'Gagal menghapus soal',
        });
    }
};

const getSoalByKategori = async (req, res) => {
    try {
        const { kategoriTesId } = req.params;
        const soalList = await soalService.getSoalByKategoriTes(
            parseInt(kategoriTesId)
        );
        return res.status(200).json({
            status: 'success',
            data: soalList,
        });
    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message:
                error.message || 'Gagal mendapatkan soal berdasarkan kategori',
        });
    }
};

module.exports = {
    createSoal,
    getAllSoal,
    getSoalById,
    updateSoal,
    deleteSoal,
    getSoalByKategori,
};
