const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();
const userService = require('../services/userService');

const createUser = async (req, res) => {
    try {
        const { username, password, id_biodata } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Username dan password harus diisi',
            });
        }

        const user = await userService.createUser({
            username,
            password,
            id_biodata: id_biodata || null,
        });

        res.status(201).json({
            status: 'success',
            message: 'User berhasil dibuat',
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    id_biodata: user.id_biodata,
                },
            },
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message || 'Gagal membuat user',
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();

        res.status(200).json({
            status: 'success',
            data: {
                users,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message || 'Gagal mendapatkan data users',
        });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userService.getUserById(parseInt(id));

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User tidak ditemukan',
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                user,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message || 'Gagal mendapatkan data user',
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, password, id_biodata } = req.body;

        // Verifikasi akses
        if (req.userType === 'user' && req.user.id !== parseInt(id)) {
            return res.status(403).json({
                status: 'error',
                message: 'Tidak diizinkan mengubah user lain',
            });
        }

        const updatedUser = await userService.updateUser(parseInt(id), {
            username,
            password,
            id_biodata,
        });

        res.status(200).json({
            status: 'success',
            message: 'User berhasil diperbarui',
            data: {
                user: {
                    id: updatedUser.id,
                    username: updatedUser.username,
                    id_biodata: updatedUser.id_biodata,
                },
            },
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message || 'Gagal memperbarui user',
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Verifikasi akses
        if (req.userType === 'user' && req.user.id !== parseInt(id)) {
            return res.status(403).json({
                status: 'error',
                message: 'Tidak diizinkan menghapus user lain',
            });
        }

        await userService.deleteUser(parseInt(id));

        res.status(200).json({
            status: 'success',
            message: 'User berhasil dihapus',
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message || 'Gagal menghapus user',
        });
    }
};

const createBatchUsers = async (req, res) => {
    try {
        // Menggunakan masterKesatuanId sebagai input, bukan kesatuan
        const { masterKesatuanId, jumlah } = req.body;

        if (!masterKesatuanId || !jumlah) {
            return res.status(400).json({
                status: 'error',
                message: 'masterKesatuanId dan jumlah harus diisi',
            });
        }

        const count = parseInt(jumlah);
        if (isNaN(count) || count <= 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Jumlah harus berupa angka positif',
            });
        }

        // Ambil data Master Kesatuan untuk mendapatkan prefix
        const masterKesatuan = await prisma.masterKesatuan.findUnique({
            where: { id: masterKesatuanId },
        });
        if (!masterKesatuan) {
            return res.status(404).json({
                status: 'error',
                message: 'Master Kesatuan tidak ditemukan',
            });
        }
        const prefix = masterKesatuan.nama_kesatuan;

        // Cari user existing dengan prefix yang sama
        const existingUsers = await prisma.user.findMany({
            where: {
                username: {
                    startsWith: prefix,
                },
            },
            orderBy: {
                username: 'desc',
            },
            take: 1,
        });

        let lastNumber = 0;
        if (existingUsers.length > 0) {
            const lastUsername = existingUsers[0].username;
            const numberPart = lastUsername.substring(prefix.length);
            lastNumber = parseInt(numberPart) || 0;
        }

        // Buat array untuk menyimpan user baru
        const newUsers = [];
        const hashedPassword = await bcrypt.hash('polda123', 10);

        for (let i = 1; i <= count; i++) {
            const currentNumber = lastNumber + i;
            const formattedNumber = String(currentNumber).padStart(4, '0');
            const username = `${prefix}${formattedNumber}`;

            try {
                const newUser = await prisma.user.create({
                    data: {
                        username,
                        password: hashedPassword,
                        id_biodata: null,
                    },
                });
                newUsers.push({
                    id: newUser.id,
                    username: newUser.username,
                });
            } catch (error) {
                // Lewati jika username sudah ada dan tampilkan error pada console
                console.error(
                    `Gagal membuat user ${username}: ${error.message}`
                );
            }
        }

        res.status(201).json({
            status: 'success',
            message: `${newUsers.length} user berhasil dibuat`,
            data: {
                users: newUsers,
                password: 'polda123', // Password default untuk referensi
            },
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message || 'Gagal membuat batch users',
        });
    }
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    createBatchUsers,
};
