const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createMasterJenisTes = async (data) => {
    return prisma.masterJenisTes.create({
        data: {
            nama_jenis_tes: data.nama_jenis_tes,
        },
    });
};

const getAllMasterJenisTes = async () => {
    return prisma.masterJenisTes.findMany();
};

const deleteMasterJenisTesById = async (id) => {
    return prisma.masterJenisTes.delete({
        where: { id },
    });
};

module.exports = {
    createMasterJenisTes,
    getAllMasterJenisTes,
    deleteMasterJenisTesById,
};
