const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const createUser = async (userData) => {
    // Cek username sudah digunakan di tabel User
    const existingUser = await prisma.user.findUnique({
        where: { username: userData.username },
    });
    if (existingUser) {
        throw new Error('Username sudah digunakan');
    }

    // Cek juga di tabel Admin
    const existingAdmin = await prisma.admin.findUnique({
        where: { username: userData.username },
    });
    if (existingAdmin) {
        throw new Error('Username sudah digunakan oleh admin');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Buat user baru dengan field tambahan masterKesatuanId dan nama_kota
    return prisma.user.create({
        data: {
            username: userData.username,
            password: hashedPassword,
            masterKesatuanId: userData.masterKesatuanId,
            nama_kota: userData.nama_kota,
            id_biodata: userData.id_biodata || null,
        },
    });
};

const getAllUsers = async () => {
    return prisma.user.findMany({
        select: {
            id: true,
            username: true,
            masterKesatuanId: true,
            nama_kota: true,
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
            masterKesatuanId: true,
            nama_kota: true,
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

    if (data.password) {
        updates.password = await bcrypt.hash(data.password, 10);
    }

    // Update field biodata jika ada
    if (data.id_biodata !== undefined) {
        updates.id_biodata = data.id_biodata;
    }

    // Update field masterKesatuanId dan nama_kota jika disediakan
    if (data.masterKesatuanId !== undefined) {
        updates.masterKesatuanId = data.masterKesatuanId;
    }
    if (data.nama_kota !== undefined) {
        updates.nama_kota = data.nama_kota;
    }

    return prisma.user.update({
        where: { id },
        data: updates,
        select: {
            id: true,
            username: true,
            masterKesatuanId: true,
            nama_kota: true,
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

async function hasBiodata(userId) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            id_biodata: true,
        },
    });
    return user;
}

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    hasBiodata,
};
