const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    console.log('Mulai membuat pengguna dummy...');

    try {
        // 1. Buat SUPERADMIN
        const superadminExists = await prisma.admin.findUnique({
            where: { username: 'superadmin' },
        });

        if (!superadminExists) {
            const hashedPassword = await bcrypt.hash('superadmin123', 10);
            await prisma.admin.create({
                data: {
                    username: 'superadmin',
                    password: hashedPassword,
                    role: 'SUPERADMIN',
                },
            });
            console.log('✅ Superadmin berhasil dibuat!');
        } else {
            console.log('ℹ️ Superadmin sudah ada, lewati pembuatan');
        }

        // 2. Buat ADMIN biasa
        const adminExists = await prisma.admin.findUnique({
            where: { username: 'admin' },
        });

        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await prisma.admin.create({
                data: {
                    username: 'admin',
                    password: hashedPassword,
                    role: 'ADMIN',
                },
            });
            console.log('✅ Admin berhasil dibuat!');
        } else {
            console.log('ℹ️ Admin sudah ada, lewati pembuatan');
        }

        // 3. Buat USER biasa
        const userExists = await prisma.user.findUnique({
            where: { username: 'user' },
        });

        if (!userExists) {
            const hashedPassword = await bcrypt.hash('user123', 10);
            await prisma.user.create({
                data: {
                    username: 'user',
                    password: hashedPassword,
                    id_biodata: null,
                },
            });
            console.log('✅ User berhasil dibuat!');
        } else {
            console.log('ℹ️ User sudah ada, lewati pembuatan');
        }

        console.log('\n===== Ringkasan akun dummy yang tersedia =====');
        console.log('SUPERADMIN:');
        console.log('Username: superadmin');
        console.log('Password: superadmin123');
        console.log('\nADMIN:');
        console.log('Username: admin');
        console.log('Password: admin123');
        console.log('\nUSER:');
        console.log('Username: user');
        console.log('Password: user123');
        console.log('==============================================');

        console.log('\n✅ Selesai membuat pengguna dummy!');
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
