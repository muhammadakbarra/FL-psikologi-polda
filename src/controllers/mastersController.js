const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllMastersKesatuanPangkat = async (req, res) => {
    try {
        const kesatuan = await prisma.masterKesatuan.findMany();
        const pangkat = await prisma.masterPangkat.findMany();

        res.status(200).json({
            status: 'success',
            data: {
                kesatuan,
                pangkat,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message || 'Gagal mendapatkan data masters',
        });
    }
};

module.exports = { getAllMastersKesatuanPangkat };
