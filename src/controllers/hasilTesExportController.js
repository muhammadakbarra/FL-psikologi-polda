const ExcelJS = require('exceljs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fitur 2: Export test results untuk sesi tertentu ke Excel dengan format horizontal
// Baris 1: header fields, Baris 2: data user
const exportTestResults = async (req, res) => {
    try {
        const { userTestSessionId, kategoriTesId } = req.query;
        if (!userTestSessionId || !kategoriTesId) {
            return res.status(400).json({
                status: 'error',
                message:
                    'userTestSessionId dan kategoriTesId harus disertakan sebagai query parameter',
            });
        }

        const session = await prisma.userTestSession.findFirst({
            where: {
                id: parseInt(userTestSessionId),
                kategoriTesId: parseInt(kategoriTesId),
                finishedAt: { not: null },
            },
            include: {
                user: { include: { biodata: true, masterKesatuan: true } },
                kategoriTes: true,
                userAnswers: {
                    include: {
                        soal: { include: { pilihanJawaban: true } },
                        pilihanJawaban: true, // sertakan jawaban yang dipilih user
                    },
                },
            },
        });

        if (!session) {
            return res.status(404).json({
                status: 'error',
                message: 'Test session tidak ditemukan atau belum selesai',
            });
        }

        // Sort userAnswers berdasarkan soal.id agar urutannya konsisten
        session.userAnswers.sort((a, b) => a.soal.id - b.soal.id);

        // Fixed fields
        const fixedFields = [
            { label: 'User Test Session ID', value: session.id },
            { label: 'User ID', value: session.user.id },
            { label: 'KategoriTes ID', value: session.kategoriTesId },
            { label: 'No Tes', value: session.noTes || '' },
            {
                label: 'Nama Kategori',
                value: session.kategoriTes?.nama_kategori_tes || '',
            },
            { label: 'Username', value: session.user.username },
            { label: 'NRP', value: session.user.biodata?.nrp || '' },
            {
                label: 'Kesatuan',
                value: session.user.masterKesatuan?.nama_kesatuan || '',
            },
            { label: 'Started At', value: session.startedAt },
            { label: 'Finished At', value: session.finishedAt },
        ];

        // Build question headers dan jawaban yang dipilih user
        const questionHeaders = session.userAnswers.map((ans, idx) => {
            const soalText = ans.soal?.teks_soal || `Soal ${idx + 1}`;
            return `Q${idx + 1}: ${soalText}`;
        });

        const questionAnswers = session.userAnswers.map((ans) => {
            if (ans.pilihanJawaban) {
                // Urutkan opsi yang tersedia
                const options = [...ans.soal.pilihanJawaban].sort(
                    (a, b) => a.id - b.id
                );
                // Cari indeks dari opsi yang dipilih
                const chosenIndex = options.findIndex(
                    (o) => o.id === ans.pilihanJawaban.id
                );
                const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
                return `${letters[chosenIndex] || ''}: ${
                    ans.pilihanJawaban.teks_pilihan
                }`;
            } else {
                return ans.teks_jawaban || '';
            }
        });

        // Buat header row: gabungan fixed fields dan label soal
        const headerRow = fixedFields
            .map((f) => f.label)
            .concat(questionHeaders);
        // Buat data row: gabungan nilai fixed fields dan jawaban soal
        const dataRow = fixedFields.map((f) => f.value).concat(questionAnswers);

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Test Results');

        // Tulis header row di baris 1
        worksheet.addRow(headerRow);
        // Tulis data row di baris 2
        worksheet.addRow(dataRow);

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename="test_results.xlsx"'
        );

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message || 'Gagal mengekspor data ke Excel',
        });
    }
};

// Fitur 3: Export test results konsolidasi untuk semua user ke Excel dengan format horizontal
// Baris 1: header, tiap baris berikutnya: data tiap user
const exportConsolidatedResults = async (req, res) => {
    try {
        const { kategoriTesId, kesatuanId } = req.query;
        if (!kategoriTesId || !kesatuanId) {
            return res.status(400).json({
                status: 'error',
                message:
                    'kategoriTesId dan kesatuanId harus disertakan sebagai query parameter',
            });
        }

        const sessions = await prisma.userTestSession.findMany({
            where: {
                finishedAt: { not: null },
                kategoriTesId: parseInt(kategoriTesId),
                user: { masterKesatuanId: parseInt(kesatuanId) },
            },
            include: {
                user: { include: { biodata: true, masterKesatuan: true } },
                kategoriTes: true,
                userAnswers: {
                    include: {
                        soal: { include: { pilihanJawaban: true } },
                        pilihanJawaban: true, // sertakan jawaban yang dipilih user
                    },
                },
            },
        });

        if (!sessions || sessions.length === 0) {
            return res.status(404).json({
                status: 'error',
                message:
                    'Tidak ada sesi yang ditemukan dengan filter yang diberikan',
            });
        }

        // Group sessions by user id (gunakan sesi pertama tiap user)
        const grouped = {};
        sessions.forEach((session) => {
            const userId = session.user.id;
            if (!grouped[userId]) {
                // Urutkan jawaban berdasarkan soal.id
                session.userAnswers.sort((a, b) => a.soal.id - b.soal.id);
                grouped[userId] = session;
            }
        });

        const userSessions = Object.values(grouped);

        // Fixed fields untuk tiap user
        const fixedFields = [
            { label: 'Username', getter: (s) => s.user.username },
            {
                label: 'Nama Lengkap',
                getter: (s) => s.user.biodata?.nama_lengkap || '',
            },
            { label: 'NRP', getter: (s) => s.user.biodata?.nrp || '' },
            {
                label: 'Kategori Tes',
                getter: (s) => s.kategoriTes?.nama_kategori_tes || '',
            },
            {
                label: 'Kesatuan',
                getter: (s) => s.user.masterKesatuan?.nama_kesatuan || '',
            },
            { label: 'Started At', getter: (s) => s.startedAt },
            { label: 'Finished At', getter: (s) => s.finishedAt },
        ];

        // Ambil header soal berdasarkan sesi user pertama (asumsi jumlah soal sama)
        const firstSession = userSessions[0];
        firstSession.userAnswers.sort((a, b) => a.soal.id - b.soal.id);
        const questionHeaders = firstSession.userAnswers.map((ans, idx) => {
            const soalText = ans.soal?.teks_soal || `Soal ${idx + 1}`;
            return `Q${idx + 1}: ${soalText}`;
        });

        // Header row: gabungan fixed fields dan question headers
        const headerRow = fixedFields
            .map((f) => f.label)
            .concat(questionHeaders);

        // Data rows untuk tiap user
        const dataRows = userSessions.map((s) => {
            // Nilai fixed fields
            const fixedValues = fixedFields.map((f) => f.getter(s));
            // Nilai jawaban soal
            const answers = s.userAnswers.map((ans) => {
                if (ans.pilihanJawaban) {
                    const options = [...ans.soal.pilihanJawaban].sort(
                        (a, b) => a.id - b.id
                    );
                    const chosenIndex = options.findIndex(
                        (o) => o.id === ans.pilihanJawaban.id
                    );
                    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
                    return `${letters[chosenIndex] || ''}: ${
                        ans.pilihanJawaban.teks_pilihan
                    }`;
                } else {
                    return ans.teks_jawaban || '';
                }
            });
            return fixedValues.concat(answers);
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Consolidated Results');

        // Tulis header row
        worksheet.addRow(headerRow);
        // Tulis setiap baris data user
        dataRows.forEach((row) => {
            worksheet.addRow(row);
        });

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename="consolidated_results.xlsx"'
        );

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message || 'Gagal mengekspor data ke Excel',
        });
    }
};

module.exports = {
    exportTestResults,
    exportConsolidatedResults,
};
