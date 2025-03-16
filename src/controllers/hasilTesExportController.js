const ExcelJS = require('exceljs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Feature 2: Export test results for a specific test session to Excel
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
            return res
                .status(404)
                .json({
                    status: 'error',
                    message: 'Test session tidak ditemukan atau belum selesai',
                });
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Test Results');

        // Header row
        worksheet.addRow([
            'No',
            'Username',
            'Nama Lengkap',
            'NRP',
            'Kategori Tes',
            'Kesatuan',
            'Soal',
            'Jawaban',
        ]);

        session.userAnswers.forEach((answer, index) => {
            const username = session.user.username;
            const namaLengkap = session.user.biodata?.nama_lengkap || '';
            const nrp = session.user.biodata?.nrp || '';
            const kategori = session.kategoriTes?.nama_kategori_tes || '';
            const kesatuan = session.user.masterKesatuan?.nama_kesatuan || '';
            const soal = answer.soal?.teks_soal || '';
            let jawaban = '';

            if (
                answer.soal &&
                answer.soal.pilihanJawaban &&
                answer.soal.pilihanJawaban.length > 0
            ) {
                const options = answer.soal.pilihanJawaban.sort(
                    (a, b) => a.id - b.id
                );
                const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
                jawaban = options
                    .map(
                        (option, idx) =>
                            `${letters[idx] || ''}: ${option.teks_pilihan}`
                    )
                    .join(', ');
            } else {
                jawaban = answer.teks_jawaban || '';
            }

            worksheet.addRow([
                index + 1,
                username,
                namaLengkap,
                nrp,
                kategori,
                kesatuan,
                soal,
                jawaban,
            ]);
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

// Feature 3: Export consolidated test results for all users into one Excel file
const exportConsolidatedResults = async (req, res) => {
    try {
        const sessions = await prisma.userTestSession.findMany({
            where: { finishedAt: { not: null } },
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

        // Group sessions by user id (mengambil sesi pertama untuk tiap user)
        const grouped = {};
        sessions.forEach((session) => {
            const userId = session.user.id;
            if (!grouped[userId]) {
                grouped[userId] = session;
            }
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Consolidated Results');

        // Header: Baris pertama: Field, kemudian tiap kolom untuk setiap user
        const header = ['Field'];
        const userIds = Object.keys(grouped);
        userIds.forEach((userId) => {
            const session = grouped[userId];
            header.push(session.user.username);
        });
        worksheet.addRow(header);

        const fields = [
            { label: 'Username', getter: (session) => session.user.username },
            {
                label: 'Nama Lengkap',
                getter: (session) => session.user.biodata?.nama_lengkap || '',
            },
            {
                label: 'NRP',
                getter: (session) => session.user.biodata?.nrp || '',
            },
            {
                label: 'Kategori Tes',
                getter: (session) =>
                    session.kategoriTes?.nama_kategori_tes || '',
            },
            {
                label: 'Kesatuan',
                getter: (session) =>
                    session.user.masterKesatuan?.nama_kesatuan || '',
            },
            {
                label: 'Soal',
                getter: (session) =>
                    session.userAnswers
                        .map(
                            (ans, idx) =>
                                `${idx + 1}. ${ans.soal?.teks_soal || ''}`
                        )
                        .join('\n'),
            },
            {
                label: 'Jawaban',
                getter: (session) => {
                    return session.userAnswers
                        .map((ans, idx) => {
                            if (
                                ans.soal &&
                                ans.soal.pilihanJawaban &&
                                ans.soal.pilihanJawaban.length > 0
                            ) {
                                const options = ans.soal.pilihanJawaban.sort(
                                    (a, b) => a.id - b.id
                                );
                                const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
                                return (
                                    `${idx + 1}. ` +
                                    options
                                        .map(
                                            (option, i) =>
                                                `${letters[i] || ''}: ${
                                                    option.teks_pilihan
                                                }`
                                        )
                                        .join(', ')
                                );
                            } else {
                                return `${idx + 1}. ${ans.teks_jawaban || ''}`;
                            }
                        })
                        .join('\n');
                },
            },
        ];

        fields.forEach((field) => {
            const row = [field.label];
            userIds.forEach((userId) => {
                const session = grouped[userId];
                row.push(field.getter(session));
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
