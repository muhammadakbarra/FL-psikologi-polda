const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Endpoint yang sudah ada: Mengambil data kesatuan (berdasarkan user login) dan semua data pangkat
const getAllMastersKesatuanPangkat = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { masterKesatuanId: true },
        });

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User tidak ditemukan, anda salah role!',
            });
        }

        // Ambil data kesatuan berdasarkan masterKesatuanId dari user
        const kesatuan = await prisma.masterKesatuan.findUnique({
            where: { id: user.masterKesatuanId },
            select: { id: true, nama_kesatuan: true },
        });

        // Ambil semua data pangkat
        const pangkat = await prisma.masterPangkat.findMany();

        res.status(200).json({
            status: 'success',
            message: 'Berhasil mengambil data masters',
            data: {
                kesatuan,
                pangkat,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message || 'Gagal mendapatkan data masters',
        });
    }
};

// API baru: Mengambil total jumlah user berdasarkan kesatuan menggunakan parameter :kesatuanId
const getUserCountByKesatuan = async (req, res) => {
    try {
        const kesatuanId = parseInt(req.params.kesatuanId);
        if (isNaN(kesatuanId)) {
            return res.status(400).json({
                status: 'error',
                message: 'kesatuanId harus berupa angka',
            });
        }

        const kesatuan = await prisma.masterKesatuan.findUnique({
            where: { id: kesatuanId },
            select: { id: true, nama_kesatuan: true },
        });

        if (!kesatuan) {
            return res.status(404).json({
                status: 'error',
                message: 'Kesatuan tidak ditemukan',
            });
        }

        const total = await prisma.user.count({
            where: { masterKesatuanId: kesatuanId },
        });

        res.status(200).json({
            status: 'success',
            message: `Berhasil mengambil total user untuk kesatuan ${kesatuan.nama_kesatuan}`,
            data: {
                kesatuan,
                total,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message:
                error.message ||
                'Gagal mendapatkan total user berdasarkan kesatuan',
        });
    }
};

const getTotalUserCount = async (req, res) => {
    try {
        const total = await prisma.user.count();
        res.status(200).json({
            status: 'success',
            message: 'Berhasil mengambil total user',
            data: { total },
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message || 'Gagal mendapatkan total user',
        });
    }
};

const getAllKesatuanWithUserCounts = async (req, res) => {
    try {
        // Get all kesatuan units
        const allKesatuan = await prisma.masterKesatuan.findMany({
            select: {
                id: true,
                nama_kesatuan: true,
            },
        });

        // Get user counts for each kesatuan
        const result = await Promise.all(
            allKesatuan.map(async (kesatuan) => {
                const total = await prisma.user.count({
                    where: { masterKesatuanId: kesatuan.id },
                });

                return {
                    nama_kesatuan: kesatuan.nama_kesatuan,
                    total: total.toString() // Converting to string as per your example
                };
            })
        );

        res.status(200).json({
            status: 'success',
            message: 'Berhasil mengambil data kesatuan dengan jumlah user',
            data: result
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message || 'Gagal mendapatkan data kesatuan dengan jumlah user',
        });
    }
};
module.exports = {
    getAllMastersKesatuanPangkat,
    getTotalUserCount,
    getUserCountByKesatuan,
    getAllKesatuanWithUserCounts
};
