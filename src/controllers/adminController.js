const adminService = require('../services/adminService');

const createAdmin = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Username dan password harus diisi',
            });
        }

        const admin = await adminService.createAdmin({
            username,
            password,
            role: role || 'ADMIN',
        });

        res.status(201).json({
            status: 'success',
            message: 'Admin berhasil dibuat',
            data: {
                admin: {
                    id: admin.id,
                    username: admin.username,
                    role: admin.role,
                },
            },
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message || 'Gagal membuat admin',
        });
    }
};

const getAllAdmins = async (req, res) => {
    try {
        const admins = await adminService.getAllAdmins();

        res.status(200).json({
            status: 'success',
            data: {
                admins,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message || 'Gagal mendapatkan data admins',
        });
    }
};

const getAdminById = async (req, res) => {
    try {
        const { id } = req.params;
        const admin = await adminService.getAdminById(parseInt(id));

        if (!admin) {
            return res.status(404).json({
                status: 'error',
                message: 'Admin tidak ditemukan',
            });
        }

        // Verifikasi akses
        if (
            req.userType === 'admin' &&
            req.user.id !== parseInt(id) &&
            req.role !== 'SUPERADMIN'
        ) {
            return res.status(403).json({
                status: 'error',
                message: 'Tidak diizinkan melihat admin lain',
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                admin,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message || 'Gagal mendapatkan data admin',
        });
    }
};

const updateAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, password, role } = req.body;

        // Verifikasi akses
        if (
            req.userType === 'admin' &&
            req.user.id !== parseInt(id) &&
            req.role !== 'SUPERADMIN'
        ) {
            return res.status(403).json({
                status: 'error',
                message: 'Tidak diizinkan mengubah admin lain',
            });
        }

        // Superadmin saja yang bisa mengubah role
        let roleUpdate = undefined;
        if (role && req.role === 'SUPERADMIN') {
            roleUpdate = role;
        }

        const updatedAdmin = await adminService.updateAdmin(parseInt(id), {
            username,
            password,
            role: roleUpdate,
        });

        res.status(200).json({
            status: 'success',
            message: 'Admin berhasil diperbarui',
            data: {
                admin: {
                    id: updatedAdmin.id,
                    username: updatedAdmin.username,
                    role: updatedAdmin.role,
                },
            },
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message || 'Gagal memperbarui admin',
        });
    }
};

const deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        // Superadmin tidak bisa dihapus oleh siapapun
        const admin = await adminService.getAdminById(parseInt(id));

        if (!admin) {
            return res.status(404).json({
                status: 'error',
                message: 'Admin tidak ditemukan',
            });
        }

        await adminService.deleteAdmin(parseInt(id));

        res.status(200).json({
            status: 'success',
            message: 'Admin berhasil dihapus',
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message || 'Gagal menghapus admin',
        });
    }
};

module.exports = {
    createAdmin,
    getAllAdmins,
    getAdminById,
    updateAdmin,
    deleteAdmin,
};
