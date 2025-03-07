const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const createUser = async (userData) => {
    // Cek username sudah digunakan
    const existingUser = await prisma.user.findUnique({
        where: { username: userData.username },
    });

    if (existingUser) {
        throw new Error('Username sudah digunakan');
    }

    // Cek juga di tabel admin
    const existingAdmin = await prisma.admin.findUnique({
        where: { username: userData.username },
    });

    if (existingAdmin) {
        throw new Error('Username sudah digunakan oleh admin');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Buat user baru
    return prisma.user.create({
        data: {
            username: userData.username,
            password: hashedPassword,
            id_biodata: userData.id_biodata,
        },
    });
};

const getAllUsers = async () => {
    return prisma.user.findMany({
        select: {
            id: true,
            username: true,
            id_biodata: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};

const getUserById = async (id) => {
    return prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            username: true,
            id_biodata: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};

const updateUser = async (id, data) => {
    const updates = {};

    if (data.username) {
        // Cek apakah username baru sudah digunakan
        if (data.username) {
            const existingUser = await prisma.user.findFirst({
                where: {
                    username: data.username,
                    id: { not: id },
                },
            });

            if (existingUser) {
                throw new Error('Username sudah digunakan');
            }

            const existingAdmin = await prisma.admin.findUnique({
                where: { username: data.username },
            });

            if (existingAdmin) {
                throw new Error('Username sudah digunakan oleh admin');
            }

            updates.username = data.username;
        }
    }

    if (data.password) {
        updates.password = await bcrypt.hash(data.password, 10);
    }

    if (data.id_biodata !== undefined) {
        updates.id_biodata = data.id_biodata;
    }

    return prisma.user.update({
        where: { id },
        data: updates,
        select: {
            id: true,
            username: true,
            id_biodata: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};

const deleteUser = async (id) => {
    return prisma.user.delete({
        where: { id },
    });
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};
