const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createMasterKesatuan = async (data) => {
    // data harus berisi: { nama_kesatuan }
    return prisma.masterKesatuan.create({
        data: { nama_kesatuan: data.nama_kesatuan },
    });
};

const getAllMasterKesatuan = async () => {
    return prisma.masterKesatuan.findMany();
};

const deleteMasterKesatuanById = async (id) => {
    // Cek terlebih dahulu apakah record ada
    const record = await prisma.masterKesatuan.findUnique({ where: { id } });
    if (!record) {
        throw new Error('Master Kesatuan dengan ID tersebut tidak ditemukan');
    }
    return prisma.masterKesatuan.delete({ where: { id } });
};

module.exports = {
    createMasterKesatuan,
    getAllMasterKesatuan,
    deleteMasterKesatuanById,
};
