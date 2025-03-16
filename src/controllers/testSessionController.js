// src/controllers/testSessionController.js
const testSessionService = require('../services/testSessionService');

async function createTestSession(req, res) {
    try {
        const userId = req.user.id; // ambil dari token (misalnya)
        const { kategoriTesId, noTes, jenisPengajuan } = req.body;

        if (!kategoriTesId) {
            return res.status(400).json({
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
            return res.status(404).json({
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
        const result = await testSessionService.finishTestSession(parseInt(id));
        return res.status(200).json({
            status: 'success',
            message:
                'Test session telah diselesaikan dan hasil tes telah dibuat',
            data: result,
        });
    } catch (error) {
        return res
            .status(400)
            .json({ status: 'error', message: error.message });
    }
}
const getUserTestCategoriesStatus = async (req, res) => {
    try {
        // Get the authenticated user ID from the token
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                status: 'error',
                message: 'Unauthorized access',
            });
        }

        // If user is admin and a userId param is provided, use that instead
        let userId = req.user.id;

        // Admin can check any user's status by providing a userId parameter
        if (req.user.type === 'admin' && req.query.userId) {
            userId = parseInt(req.query.userId);
        }

        const categoriesWithStatus =
            await testSessionService.getUserTestCategoriesStatus(userId);

        return res.status(200).json({
            status: 'success',
            data: categoriesWithStatus,
        });
    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: error.message || 'Failed to get test categories status',
        });
    }
};

async function getFinishedSessionsByFilter(req, res) {
    try {
        const { kategoriTesId, kesatuanId } = req.params;
        if (!kategoriTesId || !kesatuanId) {
            return res.status(400).json({
                status: 'error',
                message:
                    'kategoriTesId dan kesatuanId harus disertakan dalam URL',
            });
        }
        const sessions = await testSessionService.getFinishedSessionsByFilter(
            kategoriTesId,
            kesatuanId
        );
        res.status(200).json({
            status: 'success',
            message:
                'Berhasil mengambil data sesi ujian yang selesai berdasarkan filter',
            data: sessions,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message:
                error.message ||
                'Gagal mengambil data sesi ujian berdasarkan filter',
        });
    }
}

module.exports = {
    createTestSession,
    startTestSession,
    getTestSessionById,
    finishTestSession,
    getUserTestCategoriesStatus,
    getFinishedSessionsByFilter,
};
