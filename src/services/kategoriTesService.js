const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createKategoriTes = async (data) => {
    // data harus berisi: { nama_kategori_tes, masterJenisTesId, waktu_pengerjaan, instruksi_tes }
    return prisma.kategoriTes.create({
        data: {
            nama_kategori_tes: data.nama_kategori_tes,
            masterJenisTesId: data.masterJenisTesId,
            waktu_pengerjaan: data.waktu_pengerjaan,
            instruksi_tes: data.instruksi_tes, // Tambahkan field instruksi_tes
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

const getKategoriTesById = async (id) => {
    return prisma.kategoriTes.findUnique({
        where: { id },
        include: {
            masterJenisTes: true, // mengembalikan detail master jenis tes terkait
            soal: true, // Jika ingin mengembalikan soal-soal terkait (opsional)
        },
    });
};

module.exports = {
    createKategoriTes,
    getAllKategoriTes,
    deleteKategoriTesById,
    getKategoriTesById,
};
