const kategoriTesService = require('../services/kategoriTesService');

const createKategoriTes = async (req, res) => {
    try {
        const { nama_kategori_tes, masterJenisTesId, waktu_pengerjaan } =
            req.body;
        if (!nama_kategori_tes || !masterJenisTesId || !waktu_pengerjaan) {
            return res.status(400).json({
                status: 'error',
                message:
                    'Semua field (nama_kategori_tes, masterJenisTesId, waktu_pengerjaan) harus diisi',
            });
        }
        const newKategoriTes = await kategoriTesService.createKategoriTes({
            nama_kategori_tes,
            masterJenisTesId,
            waktu_pengerjaan,
        });
        res.status(201).json({
            status: 'success',
            message: 'Kategori Tes berhasil dibuat',
            data: newKategoriTes,
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message || 'Gagal membuat Kategori Tes',
        });
    }
};

const getAllKategoriTes = async (req, res) => {
    try {
        const kategoriTesList = await kategoriTesService.getAllKategoriTes();
        res.status(200).json({
            status: 'success',
            data: kategoriTesList,
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message || 'Gagal mendapatkan data Kategori Tes',
        });
    }
};

const deleteKategoriTesById = async (req, res) => {
    try {
        const { id } = req.params;
        await kategoriTesService.deleteKategoriTesById(parseInt(id));
        res.status(200).json({
            status: 'success',
            message: 'Kategori Tes berhasil dihapus',
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message || 'Gagal menghapus Kategori Tes',
        });
    }
};

const getKategoriTesById = async (req, res) => {
    try {
        const { id } = req.params;
        const kategoriTes = await kategoriTesService.getKategoriTesById(
            parseInt(id)
        );

        if (!kategoriTes) {
            return res.status(404).json({
                status: 'error',
                message: 'Kategori Tes tidak ditemukan',
            });
        }

        res.status(200).json({
            status: 'success',
            data: kategoriTes,
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message || 'Gagal mendapatkan data Kategori Tes',
        });
    }
};

module.exports = {
    createKategoriTes,
    getAllKategoriTes,
    deleteKategoriTesById,
    getKategoriTesById,
};
