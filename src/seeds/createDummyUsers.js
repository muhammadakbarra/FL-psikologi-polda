const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

// Daftar pangkat & kesatuan
const pangkatList = [
    'IRJEN POL',
    'BRIGJEN POL',
    'KOMBES POL',
    'AKBP',
    'KOMPOL',
    'AKP',
    'IPTU',
    'IPDA',
    'AIPTU',
    'AIPDA',
    'BRIPKA',
    'BRIGPOL',
    'BRIPTU',
    'BRIPDA',
];

const kesatuanList = [
    'POLRESTABES MAKASSAR',
    'POLRES PELABUHAN MAKASSAR',
    'POLRES GOWA',
    'POLRES TAKALAR',
    'POLRES JENEPONTO',
    'POLRES BANTAENG',
    'POLRES BULUKUMBA',
    'POLRES KEP. SELAYAR',
    'POLRES SINJAI',
    'POLRES SOPPENG',
    'POLRES BONE',
    'POLRES WAJO',
    'POLRES MAROS',
    'POLRES PANGKEP',
    'POLRES BARRU',
    'POLRES PAREPARE',
    'POLRES PINRANG',
    'POLRES SIDRAP',
    'POLRES ENREKANG',
    'POLRES TANA TORAJA',
    'POLRES TORAJA UTARA',
    'POLRES LUWU',
    'POLRES PALOPO',
    'POLRES LUWU UTARA',
    'POLRES LUWU TIMUR',
];

async function seedPangkat() {
    console.log('\n--- Seeding MasterPangkat ---');
    for (const pangkat of pangkatList) {
        const existing = await prisma.masterPangkat.findUnique({
            where: { nama_pangkat: pangkat },
        });
        if (!existing) {
            await prisma.masterPangkat.create({
                data: { nama_pangkat: pangkat },
            });
            console.log(`✅ Pangkat "${pangkat}" berhasil dibuat`);
        } else {
            console.log(`ℹ️ Pangkat "${pangkat}" sudah ada, lewati`);
        }
    }
    console.log('Selesai seeding MasterPangkat');
}

async function seedKesatuan() {
    console.log('\n--- Seeding MasterKesatuan ---');
    for (const kesatuan of kesatuanList) {
        const existing = await prisma.masterKesatuan.findUnique({
            where: { nama_kesatuan: kesatuan },
        });
        if (!existing) {
            await prisma.masterKesatuan.create({
                data: { nama_kesatuan: kesatuan },
            });
            console.log(`✅ Kesatuan "${kesatuan}" berhasil dibuat`);
        } else {
            console.log(`ℹ️ Kesatuan "${kesatuan}" sudah ada, lewati`);
        }
    }
    console.log('Selesai seeding MasterKesatuan');
}

// Tambahkan fungsi untuk seeding MasterJenisTes
async function seedMasterJenisTes() {
    console.log('\n--- Seeding MasterJenisTes ---');
    const listJenisTes = ['PILIHAN GANDA', 'ESSAY'];

    for (const jenis of listJenisTes) {
        const existing = await prisma.masterJenisTes.findUnique({
            where: { nama_jenis_tes: jenis },
        });
        if (!existing) {
            await prisma.masterJenisTes.create({
                data: { nama_jenis_tes: jenis },
            });
            console.log(`✅ MasterJenisTes "${jenis}" berhasil dibuat`);
        } else {
            console.log(`ℹ️ MasterJenisTes "${jenis}" sudah ada, lewati`);
        }
    }
    console.log('Selesai seeding MasterJenisTes');
}

async function seedUsersAndAdmins() {
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
}

async function main() {
    console.log('Mulai membuat data dummy...\n');

    try {
        // Seed pangkat & kesatuan dulu
        await seedPangkat();
        await seedKesatuan();

        // Seed MasterJenisTes (pilihan ganda, essay)
        await seedMasterJenisTes();

        // Lalu seed user & admin
        await seedUsersAndAdmins();

        console.log('\n✅ Selesai membuat data dummy!');
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
