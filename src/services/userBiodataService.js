// // src/services/userBiodataService.js
// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();
// const bcrypt = require('bcrypt');

// async function getAllUserBiodata() {
//     // Ambil semua user, beserta biodata (dengan masterPangkat) dan masterKesatuan (dari user)
//     return prisma.user.findMany({
//         include: {
//             biodata: {
//                 include: {
//                     masterPangkat: true,
//                 },
//             },
//             masterKesatuan: true,
//         },
//     });
// }

// async function getUserBiodataById(id) {
//     return prisma.user.findUnique({
//         where: { id },
//         include: {
//             biodata: {
//                 include: {
//                     masterPangkat: true,
//                 },
//             },
//             masterKesatuan: true,
//         },
//     });
// }

// async function updateUserBiodata(id, data) {
//     // Data dapat berisi: { username, password, nama_lengkap, nrp, jabatan, masterPangkatId }
//     const {
//         username,
//         password,
//         nama_lengkap,
//         nrp,
//         jabatan,
//         masterPangkatId,
//         // masterKesatuanId dihapus karena tidak ada di biodata
//     } = data;

//     // 1. Cari user terlebih dulu
//     const user = await prisma.user.findUnique({ where: { id } });
//     if (!user) throw new Error('User tidak ditemukan');

//     // 2. Siapkan data update user
//     const userUpdateData = {};
//     if (username) userUpdateData.username = username;
//     if (password) userUpdateData.password = await bcrypt.hash(password, 10);

//     // 3. Update atau buat biodata
//     if (!user.id_biodata) {
//         // Jika user belum punya biodata, buat baru tanpa masterKesatuanId
//         const newBio = await prisma.biodata.create({
//             data: {
//                 nama_lengkap: nama_lengkap || '',
//                 nrp: nrp || '',
//                 jabatan: jabatan || '',
//                 masterPangkatId: masterPangkatId || 1,
//             },
//         });
//         userUpdateData.id_biodata = newBio.id;
//     } else {
//         // Jika sudah ada biodata, update biodata
//         await prisma.biodata.update({
//             where: { id: user.id_biodata },
//             data: {
//                 nama_lengkap,
//                 nrp,
//                 jabatan,
//                 masterPangkatId,
//             },
//         });
//     }

//     // 4. Update user (jika ada perubahan)
//     await prisma.user.update({
//         where: { id },
//         data: userUpdateData,
//     });

//     // 5. Kembalikan data user + biodata terbaru
//     return getUserBiodataById(id);
// }

// async function deleteUserBiodata(id) {
//     // Hapus user (dan biodata jika ada)
//     const user = await prisma.user.findUnique({ where: { id } });
//     if (!user) throw new Error('User tidak ditemukan');

//     const biodataId = user.id_biodata;

//     // Hapus user
//     await prisma.user.delete({ where: { id } });

//     // Hapus biodata jika ada untuk menghindari orphan data
//     if (biodataId) {
//         await prisma.biodata.delete({ where: { id: biodataId } });
//     }

//     return true;
// }

// module.exports = {
//     getAllUserBiodata,
//     getUserBiodataById,
//     updateUserBiodata,
//     deleteUserBiodata,
// };

// src/services/userBiodataService.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function getAllUserBiodata() {
    // Ambil semua user, beserta biodata (dengan masterPangkat) dan masterKesatuan (dari user)
    return prisma.user.findMany({
        include: {
            biodata: {
                include: {
                    masterPangkat: true,
                },
            },
            masterKesatuan: true,
        },
    });
}

async function getUserBiodataById(id) {
    return prisma.user.findUnique({
        where: { id },
        include: {
            biodata: {
                include: {
                    masterPangkat: true,
                },
            },
            masterKesatuan: true,
        },
    });
}

async function updateUserBiodata(id, data) {
    // Data dapat berisi: { username, password, nama_lengkap, nrp, jabatan, alamat, masterPangkatId }
    const {
        username,
        password,
        nama_lengkap,
        nrp,
        jabatan,
        alamat, // Tambahkan alamat
        masterPangkatId,
    } = data;

    // 1. Cari user terlebih dulu
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new Error('User tidak ditemukan');

    // 2. Siapkan data update user
    const userUpdateData = {};
    if (username) userUpdateData.username = username;
    if (password) userUpdateData.password = await bcrypt.hash(password, 10);

    // 3. Update atau buat biodata
    if (!user.id_biodata) {
        // Jika user belum punya biodata, buat baru
        const newBio = await prisma.biodata.create({
            data: {
                nama_lengkap: nama_lengkap || '',
                nrp: nrp || '',
                jabatan: jabatan || '',
                alamat: alamat || null, // Tambahkan alamat (nullable)
                masterPangkatId: masterPangkatId || 1,
            },
        });
        userUpdateData.id_biodata = newBio.id;
    } else {
        // Jika sudah ada biodata, update biodata
        // Siapkan object update hanya dengan field yang diberikan
        const biodataUpdateData = {};
        if (nama_lengkap !== undefined)
            biodataUpdateData.nama_lengkap = nama_lengkap;
        if (nrp !== undefined) biodataUpdateData.nrp = nrp;
        if (jabatan !== undefined) biodataUpdateData.jabatan = jabatan;
        if (alamat !== undefined) biodataUpdateData.alamat = alamat; // Tambahkan alamat
        if (masterPangkatId !== undefined)
            biodataUpdateData.masterPangkatId = masterPangkatId;

        // Update hanya jika ada data yang perlu diupdate
        if (Object.keys(biodataUpdateData).length > 0) {
            await prisma.biodata.update({
                where: { id: user.id_biodata },
                data: biodataUpdateData,
            });
        }
    }

    // 4. Update user (jika ada perubahan)
    if (Object.keys(userUpdateData).length > 0) {
        await prisma.user.update({
            where: { id },
            data: userUpdateData,
        });
    }

    // 5. Kembalikan data user + biodata terbaru
    return getUserBiodataById(id);
}

async function deleteUserBiodata(id) {
    // Hapus user (dan biodata jika ada)
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new Error('User tidak ditemukan');

    const biodataId = user.id_biodata;

    // Hapus user
    await prisma.user.delete({ where: { id } });

    // Hapus biodata jika ada untuk menghindari orphan data
    if (biodataId) {
        await prisma.biodata.delete({ where: { id: biodataId } });
    }

    return true;
}

module.exports = {
    getAllUserBiodata,
    getUserBiodataById,
    updateUserBiodata,
    deleteUserBiodata,
};
