const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const xlsx = require('xlsx'); // pastikan paket xlsx sudah diinstall

// API GET: Mengambil semua data hasil tes beserta data tambahan
const getAllHasilTes = async (req, res) => {
    try {
        const hasilTesList = await prisma.hasilTes.findMany({
            include: {
                userTestSession: {
                    include: {
                        user: {
                            include: { biodata: true },
                        },
                        kategoriTes: true,
                    },
                },
                admin: true,
            },
        });

        const result = hasilTesList.map((item) => ({
            id: item.id,
            noTes: item.userTestSession?.noTes || null,
            username: item.userTestSession?.user?.username || null,
            nrp: item.userTestSession?.user?.biodata?.nrp || null,
            kategoriTes:
                item.userTestSession?.kategoriTes?.nama_kategori_tes || null,
            waktu_pengerjaan:
                item.userTestSession?.kategoriTes?.waktu_pengerjaan || null,
            finishedAt: item.userTestSession?.finishedAt || null,
            status: item.status,
            keterangan: item.keterangan || null,
            admin: item.admin
                ? { id: item.admin.id, username: item.admin.username }
                : null,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
        }));

        res.status(200).json({
            status: 'success',
            message: 'Berhasil mengambil data hasil tes',
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message || 'Gagal mendapatkan data hasil tes',
        });
    }
};

// API GET: Mengambil hasil tes berdasarkan filter kategoriTesId dan kesatuanId
const getHasilTesByFilter = async (req, res) => {
    try {
        const { kategoriTesId, kesatuanId } = req.query;
        let whereClause = {};

        if (kategoriTesId) {
            whereClause.userTestSession = {
                ...(whereClause.userTestSession || {}),
                kategoriTesId: parseInt(kategoriTesId),
            };
        }

        if (kesatuanId) {
            // Filter berdasarkan masterKesatuanId pada User yang terkait dengan UserTestSession
            whereClause.userTestSession = {
                ...(whereClause.userTestSession || {}),
                user: { masterKesatuanId: parseInt(kesatuanId) },
            };
        }

        const hasilTesList = await prisma.hasilTes.findMany({
            where: whereClause,
            include: {
                userTestSession: {
                    include: {
                        user: {
                            include: { biodata: true },
                        },
                        kategoriTes: true,
                    },
                },
                admin: true,
            },
        });

        const result = hasilTesList.map((item) => ({
            id: item.id,
            noTes: item.userTestSession?.noTes || null,
            username: item.userTestSession?.user?.username || null,
            nrp: item.userTestSession?.user?.biodata?.nrp || null,
            kategoriTes:
                item.userTestSession?.kategoriTes?.nama_kategori_tes || null,
            waktu_pengerjaan:
                item.userTestSession?.kategoriTes?.waktu_pengerjaan || null,
            finishedAt: item.userTestSession?.finishedAt || null,
            status: item.status,
            keterangan: item.keterangan || null,
            admin: item.admin
                ? { id: item.admin.id, username: item.admin.username }
                : null,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
        }));

        res.status(200).json({
            status: 'success',
            message: 'Berhasil mengambil data hasil tes berdasarkan filter',
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message:
                error.message ||
                'Gagal mendapatkan data hasil tes berdasarkan filter',
        });
    }
};

// API PUT: Memperbarui status dan keterangan hasil tes (misalnya setelah diverifikasi oleh admin)
const updateHasilTes = async (req, res) => {
    try {
        const hasilTesId = parseInt(req.params.id);
        const { status, keterangan } = req.body;
        // Asumsi, hanya admin yang dapat mengupdate hasil tes.
        const adminId = req.user.id;

        const updated = await prisma.hasilTes.update({
            where: { id: hasilTesId },
            data: {
                status,
                keterangan,
                adminId,
            },
            include: {
                userTestSession: {
                    include: {
                        user: {
                            include: { biodata: true },
                        },
                        kategoriTes: true,
                    },
                },
                admin: true,
            },
        });

        const result = {
            id: updated.id,
            noTes: updated.userTestSession?.noTes || null,
            username: updated.userTestSession?.user?.username || null,
            nrp: updated.userTestSession?.user?.biodata?.nrp || null,
            kategoriTes:
                updated.userTestSession?.kategoriTes?.nama_kategori_tes || null,
            waktu_pengerjaan:
                updated.userTestSession?.kategoriTes?.waktu_pengerjaan || null,
            finishedAt: updated.userTestSession?.finishedAt || null,
            status: updated.status,
            keterangan: updated.keterangan || null,
            admin: updated.admin
                ? { id: updated.admin.id, username: updated.admin.username }
                : null,
            createdAt: updated.createdAt,
            updatedAt: updated.updatedAt,
        };

        res.status(200).json({
            status: 'success',
            message: 'Berhasil memperbarui status hasil tes',
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message || 'Gagal memperbarui status hasil tes',
        });
    }
};

// API GET: Mengambil hasil tes berdasarkan userId
const getHasilTesByUserId = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const hasilTesList = await prisma.hasilTes.findMany({
            where: {
                userTestSession: {
                    userId: userId,
                },
            },
            include: {
                userTestSession: {
                    include: {
                        user: {
                            include: { biodata: true },
                        },
                        kategoriTes: true,
                    },
                },
                admin: true,
            },
        });

        const result = hasilTesList.map((item) => ({
            id: item.id,
            noTes: item.userTestSession?.noTes || null,
            username: item.userTestSession?.user?.username || null,
            nrp: item.userTestSession?.user?.biodata?.nrp || null,
            kategoriTes:
                item.userTestSession?.kategoriTes?.nama_kategori_tes || null,
            waktu_pengerjaan:
                item.userTestSession?.kategoriTes?.waktu_pengerjaan || null,
            finishedAt: item.userTestSession?.finishedAt || null,
            status: item.status,
            keterangan: item.keterangan || null,
            admin: item.admin
                ? { id: item.admin.id, username: item.admin.username }
                : null,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
        }));

        res.status(200).json({
            status: 'success',
            message: 'Berhasil mengambil data hasil tes berdasarkan userId',
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message:
                error.message ||
                'Gagal mendapatkan data hasil tes berdasarkan userId',
        });
    }
};

// Fungsi untuk batch update hasil tes dari file CSV/Excel berdasarkan username dan nrp
const batchUpdateHasilTesFromExcel = async (req, res) => {
    try {
        // Pastikan file sudah dikirim
        if (!req.file) {
            return res.status(400).json({
                status: 'error',
                message: 'File CSV diperlukan untuk update batch.',
            });
        }

        // Membaca file dari buffer
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0]; // Menggunakan sheet pertama
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        if (!data || data.length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Data pada file CSV kosong.',
            });
        }

        // Validasi format template CSV
        const requiredColumns = ['username', 'nrp', 'status'];
        const firstRow = data[0];

        const missingColumns = requiredColumns.filter(
            (col) => !(col in firstRow)
        );
        if (missingColumns.length > 0) {
            return res.status(400).json({
                status: 'error',
                message: `Format CSV tidak valid. Kolom yang wajib ada: ${missingColumns.join(
                    ', '
                )}`,
            });
        }

        // Array untuk menyimpan promise update dan catatan baris yang tidak ditemukan
        const updatePromises = [];
        const notFoundRecords = [];
        const processedRecords = [];

        // Proses setiap baris
        data.forEach((row, index) => {
            let { username, nrp, status, keterangan } = row;

            // Validasi data yang wajib
            if (!username || !nrp || !status) {
                processedRecords.push({
                    row: index + 2, // +2 karena indeks dimulai dari 0 dan header row
                    username,
                    nrp,
                    status: 'Error',
                    keterangan: 'Data tidak lengkap',
                });
                return; // Lewati baris jika kolom wajib tidak lengkap
            }

            // Paksa agar nrp dan username menjadi string
            username = String(username).trim();
            nrp = String(nrp).trim();
            status = String(status).trim();

            updatePromises.push(
                (async () => {
                    try {
                        // Cari record hasil tes berdasarkan username dan nrp
                        const record = await prisma.hasilTes.findFirst({
                            where: {
                                userTestSession: {
                                    user: {
                                        username: username,
                                        biodata: {
                                            nrp: nrp,
                                        },
                                    },
                                },
                            },
                            include: {
                                userTestSession: {
                                    include: {
                                        user: { include: { biodata: true } },
                                        kategoriTes: true,
                                    },
                                },
                                admin: true,
                            },
                        });

                        if (!record) {
                            notFoundRecords.push({
                                row: index + 2,
                                username,
                                nrp,
                            });
                            processedRecords.push({
                                row: index + 2,
                                username,
                                nrp,
                                status: 'Error',
                                keterangan: 'Data tidak ditemukan',
                            });
                            return null; // Indikasikan tidak ditemukan
                        }

                        // Perbarui record yang ditemukan
                        const updated = await prisma.hasilTes.update({
                            where: { id: record.id },
                            data: {
                                status,
                                keterangan: keterangan || null,
                                adminId: req.user.id, // Diupdate berdasarkan admin yang sedang login
                            },
                            include: {
                                userTestSession: {
                                    include: {
                                        user: { include: { biodata: true } },
                                        kategoriTes: true,
                                    },
                                },
                                admin: true,
                            },
                        });

                        processedRecords.push({
                            row: index + 2,
                            username,
                            nrp,
                            status: 'Success',
                            keterangan: 'Data berhasil diperbarui',
                        });

                        return updated;
                    } catch (error) {
                        processedRecords.push({
                            row: index + 2,
                            username,
                            nrp,
                            status: 'Error',
                            keterangan: error.message,
                        });
                        return null;
                    }
                })()
            );
        });

        const updateResults = await Promise.all(updatePromises);
        const updatedRecords = updateResults.filter(
            (result) => result !== null
        );

        // Format response agar konsisten dengan endpoint update tunggal
        const formattedResults = updatedRecords.map((record) => ({
            id: record.id,
            noTes: record.userTestSession?.noTes || null,
            username: record.userTestSession?.user?.username || null,
            nrp: record.userTestSession?.user?.biodata?.nrp || null,
            kategoriTes:
                record.userTestSession?.kategoriTes?.nama_kategori_tes || null,
            waktu_pengerjaan:
                record.userTestSession?.kategoriTes?.waktu_pengerjaan || null,
            finishedAt: record.userTestSession?.finishedAt || null,
            status: record.status,
            keterangan: record.keterangan || null,
            admin: record.admin
                ? { id: record.admin.id, username: record.admin.username }
                : null,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
        }));

        // Buat file laporan hasil pemrosesan
        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(processedRecords);
        xlsx.utils.book_append_sheet(wb, ws, 'Hasil Pemrosesan');
        const reportBuffer = xlsx.write(wb, {
            type: 'buffer',
            bookType: 'xlsx',
        });

        res.status(200).json({
            status: 'success',
            message: `Berhasil memperbarui ${formattedResults.length} record. Tidak ditemukan: ${notFoundRecords.length} record.`,
            data: {
                updatedRecords: formattedResults,
                notFound: notFoundRecords,
                processedRecords: processedRecords,
                totalProcessed: data.length,
                reportFile: reportBuffer.toString('base64'),
            },
        });
    } catch (error) {
        console.error('Error in batch update:', error);
        res.status(500).json({
            status: 'error',
            message:
                error.message ||
                'Gagal memperbarui status hasil tes secara batch.',
        });
    }
};
module.exports = {
    getAllHasilTes,
    getHasilTesByFilter,
    updateHasilTes,
    getHasilTesByUserId,
    batchUpdateHasilTesFromExcel,
};
