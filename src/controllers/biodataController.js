const biodataService = require('../services/biodataService');
const createBiodata = async (req, res) => {
    try {
        const { userId, nama_lengkap, nrp, jabatan, alamat, masterPangkatId } =
            req.body;

        // Validasi sederhana
        if (!nama_lengkap || !nrp || !jabatan || !masterPangkatId) {
            return res.status(400).json({
                status: 'error',
                message:
                    'nama_lengkap, nrp, jabatan, dan masterPangkatId harus diisi',
            });
        }

        // Panggil service untuk membuat biodata & update user
        const newBiodata = await biodataService.createBiodata({
            userId,
            nama_lengkap,
            nrp,
            jabatan,
            alamat, // Tambahkan alamat
            masterPangkatId: parseInt(masterPangkatId),
        });

        res.status(201).json({
            status: 'success',
            message: 'Biodata berhasil dibuat',
            data: newBiodata,
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message || 'Gagal membuat biodata',
        });
    }
};

const getBiodataById = async (req, res) => {
    try {
        const { id } = req.params;
        const biodata = await biodataService.getBiodataById(parseInt(id));
        if (!biodata) {
            return res.status(404).json({
                status: 'error',
                message: 'Biodata tidak ditemukan',
            });
        }
        res.status(200).json({
            status: 'success',
            data: biodata,
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message || 'Gagal mendapatkan data biodata',
        });
    }
};

module.exports = {
    createBiodata,
    getBiodataById,
};
