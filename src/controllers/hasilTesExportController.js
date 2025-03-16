const ExcelJS = require('exceljs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fitur 2: Export test results untuk sesi tertentu ke Excel
// Format: Kolom A berisi field label, dan kolom B (satu user) berisi nilai masing-masing
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

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Test Results');

        // Daftar field tetap
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

        // Ambil label soal dari setiap userAnswer (asumsi urutannya sama)
        const questionLabels = session.userAnswers.map((ans, idx) => {
            const soalText = ans.soal?.teks_soal || `Soal ${idx + 1}`;
            return { label: `Q${idx + 1}: ${soalText}` };
        });

        // Buat header kolom (Field) pada kolom A dan data user pada kolom B
        // Kolom A: daftar field (fixedFields + questionLabels)
        // Kolom B: nilai dari session untuk masing-masing field
        let rowIndex = 1;
        // Buat header judul pada cell A1
        worksheet.getCell(`A1`).value = 'Field';
        worksheet.getCell(`B1`).value = session.user.username; // nama user sebagai header kolom B

        // Tulis fixed fields mulai dari baris 2
        fixedFields.forEach((field) => {
            rowIndex++;
            worksheet.getCell(`A${rowIndex}`).value = field.label;
            worksheet.getCell(`B${rowIndex}`).value = field.value;
        });

        // Tulis setiap pertanyaan (soal) dan jawaban
        session.userAnswers.forEach((ans, idx) => {
            rowIndex++;
            const label = `Q${idx + 1}: ${ans.soal?.teks_soal || ''}`;
            // Jika pilihan jawaban ada, urutkan dan format dengan huruf; jika tidak, gunakan teks jawaban
            let answerText = '';
            if (
                ans.soal &&
                ans.soal.pilihanJawaban &&
                ans.soal.pilihanJawaban.length > 0
            ) {
                const options = ans.soal.pilihanJawaban.sort(
                    (a, b) => a.id - b.id
                );
                const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
                answerText = options
                    .map(
                        (option, i) =>
                            `${letters[i] || ''}: ${option.teks_pilihan}`
                    )
                    .join(', ');
            } else {
                answerText = ans.teks_jawaban || '';
            }
            worksheet.getCell(`A${rowIndex}`).value = label;
            worksheet.getCell(`B${rowIndex}`).value = answerText;
        });

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

// Fitur 3: Export test results konsolidasi untuk semua user ke Excel
// Format: Kolom A: Field, tiap kolom selanjutnya: data untuk tiap user
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

        // Fixed fields untuk setiap user
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
            {
                label: 'Pangkat',
                getter: (s) =>
                    s.user.biodata?.masterPangkat?.nama_pangkat || '',
            },
            { label: 'Started At', getter: (s) => s.startedAt },
            { label: 'Finished At', getter: (s) => s.finishedAt },
        ];

        // Buat workbook dan worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Consolidated Results');

        // Baris 1: Header kolom untuk setiap user
        // Kolom A: "Field", kolom selanjutnya: username tiap user
        const headerRow = ['Field'];
        userSessions.forEach((s) => headerRow.push(s.user.username));
        worksheet.addRow(headerRow);

        // Baris-baris berikutnya: setiap baris adalah field, kemudian nilai dari tiap user
        fixedFields.forEach((field) => {
            const row = [field.label];
            userSessions.forEach((s) => {
                row.push(field.getter(s));
            });
            worksheet.addRow(row);
        });

        // Untuk setiap soal, ambil label soal sebagai field dan masing-masing jawaban
        // Asumsikan semua user memiliki jumlah soal yang sama berdasarkan sesi pertama
        const firstSession = userSessions[0];
        firstSession.userAnswers.sort((a, b) => a.soal.id - b.soal.id);
        firstSession.userAnswers.forEach((ans, idx) => {
            const row = [`Q${idx + 1}: ${ans.soal?.teks_soal || ''}`];
            userSessions.forEach((s) => {
                // Temukan jawaban untuk soal ke-(idx) pada sesi user s
                s.userAnswers.sort((a, b) => a.soal.id - b.soal.id);
                const answer = s.userAnswers[idx];
                let answerText = '';
                if (answer) {
                    if (
                        answer.soal &&
                        answer.soal.pilihanJawaban &&
                        answer.soal.pilihanJawaban.length > 0
                    ) {
                        const options = answer.soal.pilihanJawaban.sort(
                            (a, b) => a.id - b.id
                        );
                        const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
                        answerText = options
                            .map(
                                (option, i) =>
                                    `${letters[i] || ''}: ${
                                        option.teks_pilihan
                                    }`
                            )
                            .join(', ');
                    } else {
                        answerText = answer.teks_jawaban || '';
                    }
                }
                row.push(answerText);
            });
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
