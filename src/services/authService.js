const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');

const prisma = new PrismaClient();

const login = async (username, password) => {
    // Coba cek admin terlebih dahulu
    const admin = await prisma.admin.findUnique({
        where: { username },
    });

    if (admin) {
        // Verify admin password
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (isPasswordValid) {
            // Generate JWT token untuk admin
            const token = jwt.sign(
                {
                    id: admin.id,
                    type: 'admin',
                },
                config.jwtSecret,
                { expiresIn: config.jwtExpiresIn }
            );

            return {
                user: {
                    id: admin.id,
                    username: admin.username,
                    role: admin.role,
                },
                role: admin.role,
                token,
            };
        }
    }

    // Jika bukan admin, coba cek user
    const user = await prisma.user.findUnique({
        where: { username },
    });

    if (user) {
        // Verify user password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            // Generate JWT token untuk user
            const token = jwt.sign(
                {
                    id: user.id,
                    type: 'user',
                },
                config.jwtSecret,
                { expiresIn: config.jwtExpiresIn }
            );

            return {
                user: {
                    id: user.id,
                    username: user.username,
                    id_biodata: user.id_biodata,
                },
                role: 'USER',
                token,
            };
        }
    }

    // Jika tidak ditemukan di kedua tabel atau password salah
    throw new Error('Username atau password salah');
};

module.exports = {
    login,
};
