const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// API GET: Mengambil semua data hasil tes beserta data tambahan
const getAllHasilTes = async (req, res) => {
    try {
        const hasilTesList = await prisma.hasilTes.findMany({
            include: {
                userTestSession: {
                    include: {
                        user: {
                            include: { biodata: true },
                        },
                        kategoriTes: true,
                    },
                },
                admin: true,
            },
        });

        const result = hasilTesList.map((item) => ({
            id: item.id,
            username: item.userTestSession?.user?.username || null,
            nrp: item.userTestSession?.user?.biodata?.nrp || null,
            kategoriTes:
                item.userTestSession?.kategoriTes?.nama_kategori_tes || null,
            waktu_pengerjaan:
                item.userTestSession?.kategoriTes?.waktu_pengerjaan || null,
            finishedAt: item.userTestSession?.finishedAt || null,
            status: item.status,
            keterangan: item.keterangan || null,
            admin: item.admin
                ? { id: item.admin.id, username: item.admin.username }
                : null,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
        }));

        res.status(200).json({
            status: 'success',
            message: 'Berhasil mengambil data hasil tes',
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message || 'Gagal mendapatkan data hasil tes',
        });
    }
};

// API GET: Mengambil hasil tes berdasarkan filter kategoriTesId dan kesatuanId
const getHasilTesByFilter = async (req, res) => {
    try {
        const { kategoriTesId, kesatuanId } = req.query;
        let whereClause = {};

        if (kategoriTesId) {
            whereClause.userTestSession = {
                ...(whereClause.userTestSession || {}),
                kategoriTesId: parseInt(kategoriTesId),
            };
        }

        if (kesatuanId) {
            // Filter berdasarkan masterKesatuanId pada User yang terkait dengan UserTestSession
            whereClause.userTestSession = {
                ...(whereClause.userTestSession || {}),
                user: { masterKesatuanId: parseInt(kesatuanId) },
            };
        }

        const hasilTesList = await prisma.hasilTes.findMany({
            where: whereClause,
            include: {
                userTestSession: {
                    include: {
                        user: {
                            include: { biodata: true },
                        },
                        kategoriTes: true,
                    },
                },
                admin: true,
            },
        });

        const result = hasilTesList.map((item) => ({
            id: item.id,
            username: item.userTestSession?.user?.username || null,
            nrp: item.userTestSession?.user?.biodata?.nrp || null,
            kategoriTes:
                item.userTestSession?.kategoriTes?.nama_kategori_tes || null,
            waktu_pengerjaan:
                item.userTestSession?.kategoriTes?.waktu_pengerjaan || null,
            finishedAt: item.userTestSession?.finishedAt || null,
            status: item.status,
            keterangan: item.keterangan || null,
            admin: item.admin
                ? { id: item.admin.id, username: item.admin.username }
                : null,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
        }));

        res.status(200).json({
            status: 'success',
            message: 'Berhasil mengambil data hasil tes berdasarkan filter',
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message:
                error.message ||
                'Gagal mendapatkan data hasil tes berdasarkan filter',
        });
    }
};

// API PUT: Memperbarui status dan keterangan hasil tes (misalnya setelah diverifikasi oleh admin)
const updateHasilTes = async (req, res) => {
    try {
        const hasilTesId = parseInt(req.params.id);
        const { status, keterangan } = req.body;
        // Asumsi, hanya admin yang dapat mengupdate hasil tes.
        const adminId = req.user.id;

        const updated = await prisma.hasilTes.update({
            where: { id: hasilTesId },
            data: {
                status,
                keterangan,
                adminId,
            },
            include: {
                userTestSession: {
                    include: {
                        user: {
                            include: { biodata: true },
                        },
                        kategoriTes: true,
                    },
                },
                admin: true,
            },
        });

        const result = {
            id: updated.id,
            username: updated.userTestSession?.user?.username || null,
            nrp: updated.userTestSession?.user?.biodata?.nrp || null,
            kategoriTes:
                updated.userTestSession?.kategoriTes?.nama_kategori_tes || null,
            waktu_pengerjaan:
                updated.userTestSession?.kategoriTes?.waktu_pengerjaan || null,
            finishedAt: updated.userTestSession?.finishedAt || null,
            status: updated.status,
            keterangan: updated.keterangan || null,
            admin: updated.admin
                ? { id: updated.admin.id, username: updated.admin.username }
                : null,
            createdAt: updated.createdAt,
            updatedAt: updated.updatedAt,
        };

        res.status(200).json({
            status: 'success',
            message: 'Berhasil memperbarui status hasil tes',
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message || 'Gagal memperbarui status hasil tes',
        });
    }
};

module.exports = {
    getAllHasilTes,
    getHasilTesByFilter,
    updateHasilTes,
};
