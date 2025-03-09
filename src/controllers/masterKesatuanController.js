const masterKesatuanService = require('../services/masterKesatuanService');

const createMasterKesatuan = async (req, res) => {
    try {
        const { nama_kesatuan } = req.body;
        if (!nama_kesatuan) {
            return res.status(400).json({
                status: 'error',
                message: 'nama_kesatuan harus diisi',
            });
        }
        const newRecord = await masterKesatuanService.createMasterKesatuan({
            nama_kesatuan,
        });
        res.status(201).json({
            status: 'success',
            message: 'Master Kesatuan berhasil dibuat',
            data: newRecord,
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message || 'Gagal membuat Master Kesatuan',
        });
    }
};

const getAllMasterKesatuan = async (req, res) => {
    try {
        const records = await masterKesatuanService.getAllMasterKesatuan();
        res.status(200).json({
            status: 'success',
            data: records,
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message || 'Gagal mendapatkan data Master Kesatuan',
        });
    }
};

const deleteMasterKesatuanById = async (req, res) => {
    try {
        const { id } = req.params;
        await masterKesatuanService.deleteMasterKesatuanById(parseInt(id));
        res.status(200).json({
            status: 'success',
            message: 'Master Kesatuan berhasil dihapus',
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message || 'Gagal menghapus Master Kesatuan',
        });
    }
};

module.exports = {
    createMasterKesatuan,
    getAllMasterKesatuan,
    deleteMasterKesatuanById,
};
