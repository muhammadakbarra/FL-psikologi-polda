// src/services/soalService.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createSoal(data) {
    // data: { kategoriTesId, teks_soal, gambar_soal, pilihanJawaban }
    const { kategoriTesId, teks_soal, gambar_soal, pilihanJawaban } = data;

    const newSoal = await prisma.soal.create({
        data: {
            kategoriTesId,
            teks_soal,
            gambar_soal, // path file (string) atau null
        },
    });

    if (pilihanJawaban && pilihanJawaban.length > 0) {
        for (const pj of pilihanJawaban) {
            await prisma.pilihanJawaban.create({
                data: {
                    soalId: newSoal.id,
                    teks_pilihan: pj.teks_pilihan || null,
                    gambar_pilihan: pj.gambar_pilihan || null,
                },
            });
        }
    }

    return newSoal;
}

async function getAllSoal() {
    return prisma.soal.findMany({
        include: {
            kategoriTes: true,
            pilihanJawaban: true,
        },
    });
}

async function getSoalById(id) {
    return prisma.soal.findUnique({
        where: { id },
        include: {
            kategoriTes: true,
            pilihanJawaban: true,
        },
    });
}

async function updateSoal(id, data) {
    const { teks_soal, gambar_soal, pilihanJawaban } = data;

    const updatedSoal = await prisma.soal.update({
        where: { id },
        data: {
            teks_soal,
            gambar_soal,
        },
        include: {
            pilihanJawaban: true,
        },
    });

    // Jika ada pilihanJawaban, kita hapus dulu semua, lalu insert ulang (opsional)
    if (pilihanJawaban) {
        await prisma.pilihanJawaban.deleteMany({
            where: { soalId: id },
        });

        for (const pj of pilihanJawaban) {
            await prisma.pilihanJawaban.create({
                data: {
                    soalId: id,
                    teks_pilihan: pj.teks_pilihan || null,
                    gambar_pilihan: pj.gambar_pilihan || null,
                },
            });
        }
    }

    return getSoalById(id);
}

async function deleteSoal(id) {
    await prisma.pilihanJawaban.deleteMany({
        where: { soalId: id },
    });
    return prisma.soal.delete({
        where: { id },
    });
}

async function getSoalByKategoriTes(kategoriTesId) {
    return prisma.soal.findMany({
        where: { kategoriTesId },
        include: {
            kategoriTes: true,
            pilihanJawaban: true,
        },
    });
}

module.exports = {
    createSoal,
    getAllSoal,
    getSoalById,
    updateSoal,
    deleteSoal,
    getSoalByKategoriTes,
};
