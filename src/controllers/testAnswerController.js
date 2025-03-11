// src/controllers/testAnswerController.js
const testAnswerService = require('../services/testAnswerService');

async function createUserAnswer(req, res) {
    try {
        const { userTestSessionId, soalId, pilihanJawabanId, teks_jawaban } =
            req.body;

        if (!userTestSessionId || !soalId) {
            return res.status(400).json({
                status: 'error',
                message: 'userTestSessionId dan soalId harus diisi',
            });
        }

        const answer = await testAnswerService.createUserAnswer({
            userTestSessionId: parseInt(userTestSessionId),
            soalId: parseInt(soalId),
            pilihanJawabanId: pilihanJawabanId
                ? parseInt(pilihanJawabanId)
                : undefined,
            teks_jawaban,
        });

        return res.status(201).json({
            status: 'success',
            data: answer,
            message: 'Jawaban berhasil disimpan',
        });
    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: error.message,
        });
    }
}

async function updateUserAnswer(req, res) {
    try {
        const { id } = req.params;
        const { pilihanJawabanId, teks_jawaban } = req.body;

        const updated = await testAnswerService.updateUserAnswer(parseInt(id), {
            pilihanJawabanId: pilihanJawabanId
                ? parseInt(pilihanJawabanId)
                : undefined,
            teks_jawaban,
        });

        return res.status(200).json({
            status: 'success',
            data: updated,
            message: 'Jawaban berhasil diperbarui',
        });
    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: error.message,
        });
    }
}

async function getAnswersBySession(req, res) {
    try {
        const { sessionId } = req.params;
        const answers = await testAnswerService.getAnswersBySession(
            parseInt(sessionId)
        );
        return res.status(200).json({
            status: 'success',
            data: answers,
        });
    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: error.message,
        });
    }
}

module.exports = {
    createUserAnswer,
    updateUserAnswer,
    getAnswersBySession,
};
