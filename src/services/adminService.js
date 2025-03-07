const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const createAdmin = async (adminData) => {
    // Cek username sudah digunakan di admin
    const existingAdmin = await prisma.admin.findUnique({
        where: { username: adminData.username },
    });

    if (existingAdmin) {
        throw new Error('Username sudah digunakan');
    }

    // Cek juga di tabel user
    const existingUser = await prisma.user.findUnique({
        where: { username: adminData.username },
    });

    if (existingUser) {
        throw new Error('Username sudah digunakan oleh user');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    // Validasi role
    let role = adminData.role;
    if (role !== 'ADMIN' && role !== 'SUPERADMIN') {
        role = 'ADMIN'; // Default ke ADMIN jika invalid
    }

    // Buat admin baru
    return prisma.admin.create({
        data: {
            username: adminData.username,
            password: hashedPassword,
            role,
        },
    });
};

const getAllAdmins = async () => {
    return prisma.admin.findMany({
        select: {
            id: true,
            username: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};

const getAdminById = async (id) => {
    return prisma.admin.findUnique({
        where: { id },
        select: {
            id: true,
            username: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};

const updateAdmin = async (id, data) => {
    const updates = {};

    if (data.username) {
        // Cek apakah username baru sudah digunakan
        const existingAdmin = await prisma.admin.findFirst({
            where: {
                username: data.username,
                id: { not: id },
            },
        });

        if (existingAdmin) {
            throw new Error('Username sudah digunakan');
        }

        const existingUser = await prisma.user.findUnique({
            where: { username: data.username },
        });

        if (existingUser) {
            throw new Error('Username sudah digunakan oleh user');
        }

        updates.username = data.username;
    }

    if (data.password) {
        updates.password = await bcrypt.hash(data.password, 10);
    }

    if (data.role) {
        updates.role = data.role;
    }

    return prisma.admin.update({
        where: { id },
        data: updates,
        select: {
            id: true,
            username: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};

const deleteAdmin = async (id) => {
    return prisma.admin.delete({
        where: { id },
    });
};

module.exports = {
    createAdmin,
    getAllAdmins,
    getAdminById,
    updateAdmin,
    deleteAdmin,
};
