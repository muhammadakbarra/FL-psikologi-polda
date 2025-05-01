#!/usr/bin/env node
/**
 *  delete-admin.js
 *  Hapus akun admin melalui CLI
 *  Cara pakai:
 *    node delete-admin.js --u username
 *  Opsi:
 *    -u / --username : wajib
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// --- Bantuan parsing argumen sangat ringan ---------------
const args = {};
process.argv.slice(2).forEach((arg, i, arr) => {
    if (arg === '-u' || arg === '--username') args.username = arr[i + 1];
});

// --- Validasi input --------------------------------------
(async () => {
    try {
        if (!args.username) {
            console.error('❌  Username (-u) wajib diisi!');
            process.exit(1);
        }

        // Cek apakah username ada
        const admin = await prisma.admin.findUnique({
            where: { username: args.username },
        });

        if (!admin) {
            console.error(`❌  Username "${args.username}" tidak ditemukan!`);
            process.exit(1);
        }

        // Hapus admin
        await prisma.admin.delete({
            where: { username: args.username },
        });
        console.log(`✅  Admin "${args.username}" berhasil dihapus!`);
    } catch (err) {
        console.error('❌  Gagal menghapus admin:', err.message);
    } finally {
        await prisma.$disconnect();
    }
})();
