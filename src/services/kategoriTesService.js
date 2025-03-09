const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createKategoriTes = async (data) => {
    // data harus berisi: { nama_kategori_tes, masterJenisTesId, waktu_pengerjaan }
    return prisma.kategoriTes.create({
        data: {
            nama_kategori_tes: data.nama_kategori_tes,
            masterJenisTesId: data.masterJenisTesId,
            waktu_pengerjaan: data.waktu_pengerjaan,
        },
    });
};

const getAllKategoriTes = async () => {
    return prisma.kategoriTes.findMany({
        include: {
            masterJenisTes: true, // mengembalikan detail master jenis tes terkait
        },
    });
};

const deleteKategoriTesById = async (id) => {
    return prisma.kategoriTes.delete({
        where: { id },
    });
};

module.exports = {
    createKategoriTes,
    getAllKategoriTes,
    deleteKategoriTesById,
};
