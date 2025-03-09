const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createMasterPangkat = async (data) => {
    // data harus berisi: { nama_pangkat }
    return prisma.masterPangkat.create({
        data: { nama_pangkat: data.nama_pangkat },
    });
};

const getAllMasterPangkat = async () => {
    return prisma.masterPangkat.findMany();
};

const deleteMasterPangkatById = async (id) => {
    // Cek terlebih dahulu apakah record ada
    const record = await prisma.masterPangkat.findUnique({ where: { id } });
    if (!record) {
        throw new Error('Master Pangkat dengan ID tersebut tidak ditemukan');
    }
    return prisma.masterPangkat.delete({ where: { id } });
};

module.exports = {
    createMasterPangkat,
    getAllMasterPangkat,
    deleteMasterPangkatById,
};
