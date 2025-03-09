const masterPangkatService = require('../services/masterPangkatService');

const createMasterPangkat = async (req, res) => {
    try {
        const { nama_pangkat } = req.body;
        if (!nama_pangkat) {
            return res.status(400).json({
                status: 'error',
                message: 'nama_pangkat harus diisi',
            });
        }
        const newRecord = await masterPangkatService.createMasterPangkat({
            nama_pangkat,
        });
        res.status(201).json({
            status: 'success',
            message: 'Master Pangkat berhasil dibuat',
            data: newRecord,
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message || 'Gagal membuat Master Pangkat',
        });
    }
};

const getAllMasterPangkat = async (req, res) => {
    try {
        const records = await masterPangkatService.getAllMasterPangkat();
        res.status(200).json({
            status: 'success',
            data: records,
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message || 'Gagal mendapatkan data Master Pangkat',
        });
    }
};

const deleteMasterPangkatById = async (req, res) => {
    try {
        const { id } = req.params;
        await masterPangkatService.deleteMasterPangkatById(parseInt(id));
        res.status(200).json({
            status: 'success',
            message: 'Master Pangkat berhasil dihapus',
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message || 'Gagal menghapus Master Pangkat',
        });
    }
};

module.exports = {
    createMasterPangkat,
    getAllMasterPangkat,
    deleteMasterPangkatById,
};
