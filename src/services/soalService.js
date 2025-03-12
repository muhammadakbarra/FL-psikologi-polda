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

async function importSoalFromExcel(kategoriTesId, jenis_soal, data) {
    const results = {
        total: data.length,
        success: 0,
        failed: 0,
        failed_rows: [],
        created_soal: [], // Track soal yang berhasil dibuat
    };

    for (let i = 0; i < data.length; i++) {
        try {
            const row = data[i];

            // Debug: log data row
            console.log(`Processing row ${i + 2}:`, JSON.stringify(row));

            // Validasi minimal harus ada soal
            if (!row.soal) {
                results.failed++;
                results.failed_rows.push({
                    row: i + 2,
                    reason: 'Teks soal kosong',
                });
                continue;
            }

            // Buat soal baru dengan konversi teks_soal ke string
            const newSoal = await prisma.soal.create({
                data: {
                    kategoriTesId: kategoriTesId,
                    teks_soal: String(row.soal), // Konversi ke string
                    gambar_soal: null, // Gambar tidak dihandle via Excel
                },
            });

            // Untuk soal pilihan ganda, tambahkan pilihan jawaban
            if (jenis_soal === 'pilihan_ganda') {
                // Asumsikan pilihan jawaban ada di kolom pilihan_a, pilihan_b, dst.
                const pilihanKeys = Object.keys(row).filter(
                    (key) =>
                        key.startsWith('pilihan_') &&
                        row[key] !== undefined &&
                        row[key] !== null
                );

                console.log(
                    `Found ${pilihanKeys.length} pilihan keys:`,
                    pilihanKeys
                );

                // Jika tidak ada pilihan, lanjutkan ke soal berikutnya
                if (pilihanKeys.length === 0) {
                    results.failed++;
                    results.failed_rows.push({
                        row: i + 2,
                        reason: 'Soal pilihan ganda tanpa pilihan jawaban',
                    });

                    // Hapus soal yang sudah dibuat
                    await prisma.soal.delete({
                        where: { id: newSoal.id },
                    });

                    continue;
                }

                // Tambahkan pilihan jawaban dengan konversi nilai ke string
                const pilihanJawaban = [];
                for (const key of pilihanKeys) {
                    const pilihan = await prisma.pilihanJawaban.create({
                        data: {
                            soalId: newSoal.id,
                            teks_pilihan: String(row[key]), // Konversi ke string
                            gambar_pilihan: null,
                        },
                    });
                    pilihanJawaban.push(pilihan);
                }

                // Tambahkan soal yang berhasil dibuat ke daftar
                const createdSoal = {
                    ...newSoal,
                    pilihanJawaban,
                };
                results.created_soal.push(createdSoal);
            } else {
                // Untuk soal essay, langsung tambahkan ke daftar berhasil
                results.created_soal.push(newSoal);
            }

            results.success++;
        } catch (error) {
            console.error(`Error processing row ${i + 2}:`, error);
            results.failed++;
            results.failed_rows.push({
                row: i + 2,
                reason: error.message || 'Kesalahan tidak diketahui',
            });
        }
    }

    return results;
}

module.exports = {
    createSoal,
    getAllSoal,
    getSoalById,
    updateSoal,
    deleteSoal,
    getSoalByKategoriTes,
    importSoalFromExcel,
};
