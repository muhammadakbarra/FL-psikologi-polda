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
            masa_berlaku: item.masa_berlaku || null, // Tambahkan masa berlaku
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
            masa_berlaku: item.masa_berlaku || null, // Tambahkan masa berlaku
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

        // Tentukan masa berlaku berdasarkan status
        let masa_berlaku = '-';
        if (status === 'MEMENUHI_SYARAT') {
            masa_berlaku = '1 tahun';
        } else if (status === 'TIDAK_MEMENUHI_SYARAT') {
            masa_berlaku = '3 bulan';
        }

        const updated = await prisma.hasilTes.update({
            where: { id: hasilTesId },
            data: {
                status,
                keterangan,
                masa_berlaku, // Set masa berlaku otomatis
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
            masa_berlaku: updated.masa_berlaku || null, // Tambahkan masa berlaku ke response
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
            masa_berlaku: item.masa_berlaku || null, // Tambahkan masa berlaku
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
                message: 'File Excel diperlukan untuk update batch.',
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
                message: 'Data pada file Excel kosong.',
            });
        }

        // Validasi format template Excel
        const requiredColumns = ['username', 'nrp', 'status'];
        const firstRow = data[0];

        const missingColumns = requiredColumns.filter(
            (col) => !(col in firstRow)
        );
        if (missingColumns.length > 0) {
            return res.status(400).json({
                status: 'error',
                message: `Format Excel tidak valid. Kolom yang wajib ada: ${missingColumns.join(
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

            // Abaikan kolom 'no', 'noTes', dan 'masa_berlaku' karena akan diisi otomatis

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

                        // Tentukan masa berlaku berdasarkan status
                        let masa_berlaku = '-';
                        if (status === 'MEMENUHI_SYARAT') {
                            masa_berlaku = '1 tahun';
                        } else if (status === 'TIDAK_MEMENUHI_SYARAT') {
                            masa_berlaku = '3 bulan';
                        }

                        // Perbarui record yang ditemukan
                        const updated = await prisma.hasilTes.update({
                            where: { id: record.id },
                            data: {
                                status,
                                keterangan: keterangan || null,
                                masa_berlaku, // Set masa berlaku otomatis
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
                            masa_berlaku, // Tambahkan informasi masa berlaku yang diupdate
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
            masa_berlaku: record.masa_berlaku || null, // Tambahkan masa berlaku ke response
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

const deleteHasilTes = async (req, res) => {
    try {
        const hasilTesId = parseInt(req.params.id);

        // Cari hasil tes terlebih dahulu untuk mendapatkan userTestSessionId
        const hasilTes = await prisma.hasilTes.findUnique({
            where: { id: hasilTesId },
            include: {
                userTestSession: true,
            },
        });

        if (!hasilTes) {
            return res.status(404).json({
                status: 'error',
                message: 'Hasil tes tidak ditemukan',
            });
        }

        // Catat userTestSessionId untuk operasi delete berikutnya
        const userTestSessionId = hasilTes.userTestSessionId;

        // Mulai transaction agar semua operasi berhasil atau gagal bersama
        const result = await prisma.$transaction(async (tx) => {
            // 1. Hapus hasil tes terlebih dahulu
            const deletedHasilTes = await tx.hasilTes.delete({
                where: { id: hasilTesId },
            });

            // 2. Hapus semua user answers terkait dengan userTestSession
            const deletedUserAnswers = await tx.userAnswer.deleteMany({
                where: { userTestSessionId },
            });

            // 3. Hapus user test session
            const deletedUserTestSession = await tx.userTestSession.delete({
                where: { id: userTestSessionId },
            });

            // Mengembalikan data yang dihapus untuk konfirmasi
            return {
                hasilTesId: deletedHasilTes.id,
                userTestSessionId: deletedUserTestSession.id,
                userAnswersDeleted: deletedUserAnswers.count,
            };
        });

        res.status(200).json({
            status: 'success',
            message: 'Berhasil menghapus data hasil tes dan data terkait',
            data: result,
        });
    } catch (error) {
        console.error('Error deleting hasil tes:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Gagal menghapus data hasil tes',
        });
    }
};

const generateTemplateCSV = async (req, res) => {
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

        // Mengubah format data untuk CSV
        const templateData = hasilTesList.map((item, index) => {
            // Tentukan masa berlaku berdasarkan status
            let masa_berlaku = '-';
            if (item.status === 'MEMENUHI_SYARAT') {
                masa_berlaku = '1 tahun';
            } else if (item.status === 'TIDAK_MEMENUHI_SYARAT') {
                masa_berlaku = '3 bulan';
            }

            return {
                no: index + 1,
                username: item.userTestSession?.user?.username || '',
                nrp: item.userTestSession?.user?.biodata?.nrp || '',
                noTes: item.userTestSession?.noTes || '',
                masa_berlaku: masa_berlaku,
                status: item.status,
                keterangan: item.keterangan || '',
            };
        });

        // Buat file Excel
        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(templateData);
        xlsx.utils.book_append_sheet(wb, ws, 'Template Update Status');

        // Convert Excel file ke buffer
        const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

        // Set header untuk download file
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=template_update_hasil_tes.xlsx'
        );

        // Kirim file
        res.status(200).send(buffer);
    } catch (error) {
        console.error('Error generating template CSV:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Gagal generate template CSV',
        });
    }
};

module.exports = {
    getAllHasilTes,
    getHasilTesByFilter,
    updateHasilTes,
    getHasilTesByUserId,
    batchUpdateHasilTesFromExcel,
    deleteHasilTes,
    generateTemplateCSV,
};
