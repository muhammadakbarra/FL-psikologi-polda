const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTestSession({
    userId,
    kategoriTesId,
    noTes,
    jenisPengajuan,
}) {
    return prisma.userTestSession.create({
        data: {
            userId,
            kategoriTesId,
            noTes,
            jenisPengajuan,
        },
    });
}

async function startTestSession(sessionId) {
    return prisma.userTestSession.update({
        where: { id: sessionId },
        data: {
            startedAt: new Date(),
        },
    });
}

async function getTestSessionById(sessionId) {
    return prisma.userTestSession.findUnique({
        where: { id: sessionId },
        include: {
            user: true,
            kategoriTes: true,
            userAnswers: {
                include: {
                    soal: true,
                    pilihanJawaban: true,
                },
            },
        },
    });
}

async function finishTestSession(sessionId) {
    // Update test session untuk menandai selesai dengan mencatat finishedAt
    const updatedSession = await prisma.userTestSession.update({
        where: { id: sessionId },
        data: {
            finishedAt: new Date(),
        },
    });

    // Setelah sesi selesai, buat record hasil tes dengan default status MENUNGGU
    const hasilTes = await prisma.hasilTes.create({
        data: {
            userTestSessionId: sessionId,
            // Status default MENUNGGU sudah diatur melalui schema.prisma
        },
    });

    // Mengembalikan data sesi dan hasil tes
    return { updatedSession, hasilTes };
}

// Get all kategori tes with completion status for the authenticated user
async function getUserTestCategoriesStatus(userId) {
    try {
        const allKategoriTes = await prisma.kategoriTes.findMany({
            include: { masterJenisTes: true },
        });

        const completedSessions = await prisma.userTestSession.findMany({
            where: {
                userId: parseInt(userId),
                finishedAt: { not: null },
            },
            select: {
                kategoriTesId: true,
                finishedAt: true,
                noTes: true,
                jenisPengajuan: true,
            },
        });

        const inProgressSessions = await prisma.userTestSession.findMany({
            where: {
                userId: parseInt(userId),
                startedAt: { not: null },
                finishedAt: null,
            },
            select: {
                kategoriTesId: true,
                startedAt: true,
                noTes: true,
                jenisPengajuan: true,
            },
        });

        const completedMap = new Map();
        completedSessions.forEach((session) => {
            completedMap.set(session.kategoriTesId, {
                finishedAt: session.finishedAt,
                noTes: session.noTes,
                jenisPengajuan: session.jenisPengajuan,
            });
        });

        const inProgressMap = new Map();
        inProgressSessions.forEach((session) => {
            inProgressMap.set(session.kategoriTesId, {
                startedAt: session.startedAt,
                noTes: session.noTes,
                jenisPengajuan: session.jenisPengajuan,
            });
        });

        return allKategoriTes.map((kategori) => {
            const completed = completedMap.get(kategori.id);
            const inProgress = inProgressMap.get(kategori.id);
            return {
                ...kategori,
                status: completed
                    ? 'completed'
                    : inProgress
                    ? 'in_progress'
                    : 'not_started',
                finishedAt: completed ? completed.finishedAt : null,
                startedAt: inProgress ? inProgress.startedAt : null,
                noTes: completed
                    ? completed.noTes
                    : inProgress
                    ? inProgress.noTes
                    : null,
                jenisPengajuan: completed
                    ? completed.jenisPengajuan
                    : inProgress
                    ? inProgress.jenisPengajuan
                    : null,
            };
        });
    } catch (error) {
        console.error('Error fetching user test categories status:', error);
        throw error;
    }
}

module.exports = {
    createTestSession,
    startTestSession,
    getTestSessionById,
    finishTestSession,
    getUserTestCategoriesStatus,
};
