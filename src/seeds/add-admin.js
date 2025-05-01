#!/usr/bin/env node
/**
 *  add-admin.js
 *  Tambah akun admin melalui CLI
 *  Cara pakai:
 *    node add-admin.js --u adminbaru --p passwordku --role ADMIN
 *  Opsi:
 *    -u / --username :  wajib
 *    -p / --password :  wajib
 *    -r / --role     :  ADMIN | SUPERADMIN  (default: ADMIN)
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

// --- Bantuan parsing argumen sangat ringan ---------------
const args = {};
process.argv.slice(2).forEach((arg, i, arr) => {
    if (arg === '-u' || arg === '--username') args.username = arr[i + 1];
    if (arg === '-p' || arg === '--password') args.password = arr[i + 1];
    if (arg === '-r' || arg === '--role') args.role = arr[i + 1];
});

// --- Validasi input --------------------------------------
(async () => {
    try {
        if (!args.username || !args.password) {
            console.error('❌  Username (-u) dan password (-p) wajib diisi!');
            process.exit(1);
        }

        const role = (args.role || 'ADMIN').toUpperCase();
        if (!['ADMIN', 'SUPERADMIN'].includes(role)) {
            console.error('❌  Role harus "ADMIN" atau "SUPERADMIN"');
            process.exit(1);
        }

        // Cek apakah username sudah dipakai
        const existing = await prisma.admin.findUnique({
            where: { username: args.username },
        });
        if (existing) {
            console.error(`❌  Username "${args.username}" sudah terdaftar!`);
            process.exit(1);
        }

        // Hash & simpan
        const hashed = await bcrypt.hash(args.password, 10);
        await prisma.admin.create({
            data: {
                username: args.username,
                password: hashed,
                role,
            },
        });
        console.log(`✅  Admin "${args.username}" (${role}) berhasil dibuat!`);
    } catch (err) {
        console.error('❌  Gagal membuat admin:', err.message);
    } finally {
        await prisma.$disconnect();
    }
})();
