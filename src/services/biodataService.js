const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createBiodata(data) {
    // 1. Buat record biodata baru
    const newBiodata = await prisma.biodata.create({
        data: {
            nama_lengkap: data.nama_lengkap,
            nrp: data.nrp,
            jabatan: data.jabatan,
            masterKesatuanId: data.masterKesatuanId,
            masterPangkatId: data.masterPangkatId,
        },
    });

    // 2. Update tabel User -> set id_biodata
    //    Pastikan userId valid dan ada di request body
    if (data.userId) {
        await prisma.user.update({
            where: { id: data.userId },
            data: { id_biodata: newBiodata.id },
        });
    }

    return newBiodata;
}

async function getBiodataById(id) {
    return prisma.biodata.findUnique({
        where: { id },
        include: {
            masterKesatuan: true,
            masterPangkat: true,
        },
    });
}

module.exports = {
    createBiodata,
    getBiodataById,
};
