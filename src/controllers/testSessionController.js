// src/controllers/testSessionController.js
const testSessionService = require('../services/testSessionService');

async function createTestSession(req, res) {
    try {
        const userId = req.user.id; // ambil dari token (misalnya)
        const { kategoriTesId, noTes, jenisPengajuan } = req.body;

        if (!kategoriTesId) {
            return res
                .status(400)
                .json({
                    status: 'error',
                    message: 'kategoriTesId harus diisi',
                });
        }

        const session = await testSessionService.createTestSession({
            userId,
            kategoriTesId: parseInt(kategoriTesId),
            noTes,
            jenisPengajuan,
        });

        return res.status(201).json({
            status: 'success',
            message: 'Test session berhasil dibuat',
            data: session,
        });
    } catch (error) {
        return res
            .status(400)
            .json({ status: 'error', message: error.message });
    }
}

async function startTestSession(req, res) {
    try {
        const { id } = req.params; // ID session
        const session = await testSessionService.startTestSession(parseInt(id));
        return res.status(200).json({
            status: 'success',
            message: 'Test session telah dimulai',
            data: session,
        });
    } catch (error) {
        return res
            .status(400)
            .json({ status: 'error', message: error.message });
    }
}

// getTestSessionById, finishTestSession, dsb. sama seperti sebelumnya
async function getTestSessionById(req, res) {
    try {
        const { id } = req.params;
        const session = await testSessionService.getTestSessionById(
            parseInt(id)
        );
        if (!session) {
            return res
                .status(404)
                .json({
                    status: 'error',
                    message: 'Test session tidak ditemukan',
                });
        }
        return res.status(200).json({ status: 'success', data: session });
    } catch (error) {
        return res
            .status(400)
            .json({ status: 'error', message: error.message });
    }
}

async function finishTestSession(req, res) {
    try {
        const { id } = req.params;
        const session = await testSessionService.finishTestSession(
            parseInt(id)
        );
        return res.status(200).json({
            status: 'success',
            message: 'Test session telah diselesaikan',
            data: session,
        });
    } catch (error) {
        return res
            .status(400)
            .json({ status: 'error', message: error.message });
    }
}

module.exports = {
    createTestSession,
    startTestSession,
    getTestSessionById,
    finishTestSession,
};
