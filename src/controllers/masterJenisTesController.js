const masterJenisTesService = require('../services/masterJenisTesService');

const createMasterJenisTes = async (req, res) => {
    try {
        const { nama_jenis_tes } = req.body;
        if (!nama_jenis_tes) {
            return res.status(400).json({
                status: 'error',
                message: 'nama_jenis_tes harus diisi',
            });
        }
        const newEntry = await masterJenisTesService.createMasterJenisTes({
            nama_jenis_tes,
        });
        res.status(201).json({
            status: 'success',
            message: 'Master Jenis Tes berhasil dibuat',
            data: newEntry,
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message || 'Gagal membuat Master Jenis Tes',
        });
    }
};

const getAllMasterJenisTes = async (req, res) => {
    try {
        const entries = await masterJenisTesService.getAllMasterJenisTes();
        res.status(200).json({
            status: 'success',
            data: entries,
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message || 'Gagal mendapatkan data Master Jenis Tes',
        });
    }
};

const deleteMasterJenisTesById = async (req, res) => {
    try {
        const { id } = req.params;
        await masterJenisTesService.deleteMasterJenisTesById(parseInt(id));
        res.status(200).json({
            status: 'success',
            message: 'Master Jenis Tes berhasil dihapus',
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message || 'Gagal menghapus Master Jenis Tes',
        });
    }
};

module.exports = {
    createMasterJenisTes,
    getAllMasterJenisTes,
    deleteMasterJenisTesById,
};
