#!/usr/bin/env node
/**
 *  change-superadmin-password.js
 *  Ubah password akun SUPERADMIN melalui CLI
 *  Cara pakai:
 *    node change-superadmin-password.js --p passwordBaru
 *  Opsi:
 *    -p / --password : wajib
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

// --- Bantuan parsing argumen sangat ringan ---------------
const args = {};
process.argv.slice(2).forEach((arg, i, arr) => {
    if (arg === '-p' || arg === '--password') args.password = arr[i + 1];
});

// --- Validasi input --------------------------------------
(async () => {
    try {
        if (!args.password) {
            console.error('❌  Password (-p) wajib diisi!');
            process.exit(1);
        }

        // Cek apakah SUPERADMIN ada
        const superadmin = await prisma.admin.findUnique({
            where: { username: 'superadmin' },
        });

        if (!superadmin) {
            console.error(
                '❌  Admin dengan username "superadmin" tidak ditemukan!'
            );
            process.exit(1);
        }

        // Hash password baru
        const hashedPassword = await bcrypt.hash(args.password, 10);

        // Update password
        await prisma.admin.update({
            where: { username: 'superadmin' },
            data: { password: hashedPassword },
        });
        console.log(`✅  Password untuk superadmin berhasil diubah!`);
    } catch (err) {
        console.error('❌  Gagal mengubah password:', err.message);
    } finally {
        await prisma.$disconnect();
    }
})();
