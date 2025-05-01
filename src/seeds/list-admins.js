#!/usr/bin/env node
/**
 *  list-admins.js
 *  Tampilkan daftar akun admin melalui CLI
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// --- Ambil dan tampilkan daftar admin --------------------------------------
(async () => {
    try {
        const admins = await prisma.admin.findMany({
            select: {
                username: true,
                role: true,
            },
        });

        if (admins.length === 0) {
            console.log('ℹ️  Tidak ada akun admin terdaftar.');
            return;
        }

        console.log('\n===== Daftar Admin =====');
        admins.forEach((admin) => {
            console.log(`Username: ${admin.username}, Role: ${admin.role}`);
        });
        console.log('========================');
    } catch (err) {
        console.error('❌  Gagal mengambil daftar admin:', err.message);
    } finally {
        await prisma.$disconnect();
    }
})();
