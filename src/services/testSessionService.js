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
            // startedAt otomatis now() via default
        },
    });
}

async function startTestSession(sessionId) {
    return prisma.userTestSession.update({
        where: { id: sessionId },
        data: {
            startedAt: new Date(), // Simpan waktu mulai ujian
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
    return prisma.userTestSession.update({
        where: { id: sessionId },
        data: {
            finishedAt: new Date(),
        },
    });
}

module.exports = {
    createTestSession,
    startTestSession,
    getTestSessionById,
    finishTestSession,
};
