// src/controllers/userBiodataController.js
const userBiodataService = require('../services/userBiodataService');

async function getAllUserBiodata(req, res) {
    try {
        const users = await userBiodataService.getAllUserBiodata();
        // Map ke format yang diinginkan
        const data = users.map((u) => ({
            id: u.id,
            username: u.username,
            nama_lengkap: u.biodata?.nama_lengkap || null,
            nrp: u.biodata?.nrp || null,
            jabatan: u.biodata?.jabatan || null,
            pangkat: u.biodata?.masterPangkat?.nama_pangkat || null,
            kesatuan: u.masterKesatuan?.nama_kesatuan || null, // diambil dari user (bukan biodata)
        }));
        res.status(200).json({
            status: 'success',
            data,
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message,
        });
    }
}

async function getUserBiodataById(req, res) {
    try {
        const { id } = req.params;
        const user = await userBiodataService.getUserBiodataById(parseInt(id));
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User tidak ditemukan',
            });
        }
        const data = {
            id: user.id,
            username: user.username,
            nama_lengkap: user.biodata?.nama_lengkap || null,
            nrp: user.biodata?.nrp || null,
            jabatan: user.biodata?.jabatan || null,
            pangkat: user.biodata?.masterPangkat?.nama_pangkat || null,
            kesatuan: user.masterKesatuan?.nama_kesatuan || null, // diambil dari user
        };
        res.status(200).json({
            status: 'success',
            data,
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message,
        });
    }
}

async function updateUserBiodata(req, res) {
    try {
        const { id } = req.params;
        // Ambil data dari body; masterKesatuanId tidak lagi dipakai di biodata
        const {
            username,
            password,
            nama_lengkap,
            nrp,
            jabatan,
            masterPangkatId,
            // masterKesatuanId dihapus karena sekarang info kesatuan ada di tabel User
        } = req.body;

        const updatedUser = await userBiodataService.updateUserBiodata(
            parseInt(id),
            {
                username,
                password,
                nama_lengkap,
                nrp,
                jabatan,
                masterPangkatId: masterPangkatId
                    ? parseInt(masterPangkatId)
                    : undefined,
            }
        );

        const data = {
            id: updatedUser.id,
            username: updatedUser.username,
            nama_lengkap: updatedUser.biodata?.nama_lengkap || null,
            nrp: updatedUser.biodata?.nrp || null,
            jabatan: updatedUser.biodata?.jabatan || null,
            pangkat: updatedUser.biodata?.masterPangkat?.nama_pangkat || null,
            kesatuan: updatedUser.masterKesatuan?.nama_kesatuan || null, // diambil dari user
        };

        res.status(200).json({
            status: 'success',
            message: 'User biodata berhasil diperbarui',
            data,
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message,
        });
    }
}

async function deleteUserBiodata(req, res) {
    try {
        const { id } = req.params;
        await userBiodataService.deleteUserBiodata(parseInt(id));
        res.status(200).json({
            status: 'success',
            message: 'User (beserta biodata) berhasil dihapus',
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message,
        });
    }
}

module.exports = {
    getAllUserBiodata,
    getUserBiodataById,
    updateUserBiodata,
    deleteUserBiodata,
};
