// src/services/testAnswerService.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createUserAnswer({
    userTestSessionId,
    soalId,
    pilihanJawabanId,
    teks_jawaban,
}) {
    return prisma.userAnswer.create({
        data: {
            userTestSessionId,
            soalId,
            pilihanJawabanId: pilihanJawabanId || null,
            teks_jawaban: teks_jawaban || null,
            // answeredAt otomatis now() via default
        },
    });
}

async function updateUserAnswer(answerId, { pilihanJawabanId, teks_jawaban }) {
    return prisma.userAnswer.update({
        where: { id: answerId },
        data: {
            pilihanJawabanId: pilihanJawabanId || null,
            teks_jawaban: teks_jawaban || null,
        },
    });
}

async function getAnswersBySession(sessionId) {
    return prisma.userAnswer.findMany({
        where: { userTestSessionId: sessionId },
        include: {
            soal: true,
            pilihanJawaban: true,
        },
    });
}

module.exports = {
    createUserAnswer,
    updateUserAnswer,
    getAnswersBySession,
};
