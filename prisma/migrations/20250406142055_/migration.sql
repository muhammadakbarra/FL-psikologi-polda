/*
  Warnings:

  - You are about to drop the `admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `biodata` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `hasiltes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `kategoriTes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `masterJenisTes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `masterKesatuan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `masterPangkat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pilihanjawaban` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `soal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `useranswer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usertestsession` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `websitebackground` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `biodata` DROP FOREIGN KEY `Biodata_masterPangkatId_fkey`;

-- DropForeignKey
ALTER TABLE `hasiltes` DROP FOREIGN KEY `HasilTes_adminId_fkey`;

-- DropForeignKey
ALTER TABLE `hasiltes` DROP FOREIGN KEY `HasilTes_userTestSessionId_fkey`;

-- DropForeignKey
ALTER TABLE `kategoriTes` DROP FOREIGN KEY `KategoriTes_masterJenisTesId_fkey`;

-- DropForeignKey
ALTER TABLE `pilihanjawaban` DROP FOREIGN KEY `PilihanJawaban_soalId_fkey`;

-- DropForeignKey
ALTER TABLE `soal` DROP FOREIGN KEY `Soal_kategoriTesId_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_id_biodata_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_masterKesatuanId_fkey`;

-- DropForeignKey
ALTER TABLE `useranswer` DROP FOREIGN KEY `UserAnswer_pilihanJawabanId_fkey`;

-- DropForeignKey
ALTER TABLE `useranswer` DROP FOREIGN KEY `UserAnswer_soalId_fkey`;

-- DropForeignKey
ALTER TABLE `useranswer` DROP FOREIGN KEY `UserAnswer_userTestSessionId_fkey`;

-- DropForeignKey
ALTER TABLE `usertestsession` DROP FOREIGN KEY `UserTestSession_kategoriTesId_fkey`;

-- DropForeignKey
ALTER TABLE `usertestsession` DROP FOREIGN KEY `UserTestSession_userId_fkey`;

-- DropTable
DROP TABLE `admin`;

-- DropTable
DROP TABLE `biodata`;

-- DropTable
DROP TABLE `hasiltes`;

-- DropTable
DROP TABLE `kategoriTes`;

-- DropTable
DROP TABLE `masterJenisTes`;

-- DropTable
DROP TABLE `masterKesatuan`;

-- DropTable
DROP TABLE `masterPangkat`;

-- DropTable
DROP TABLE `pilihanjawaban`;

-- DropTable
DROP TABLE `soal`;

-- DropTable
DROP TABLE `user`;

-- DropTable
DROP TABLE `useranswer`;

-- DropTable
DROP TABLE `usertestsession`;

-- DropTable
DROP TABLE `websitebackground`;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `masterKesatuanId` INTEGER NOT NULL,
    `nama_kota` VARCHAR(191) NULL,
    `id_biodata` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'SUPERADMIN') NOT NULL DEFAULT 'ADMIN',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Admin_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MasterJenisTes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_jenis_tes` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `MasterJenisTes_nama_jenis_tes_key`(`nama_jenis_tes`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KategoriTes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_kategori_tes` VARCHAR(191) NOT NULL,
    `masterJenisTesId` INTEGER NOT NULL,
    `waktu_pengerjaan` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MasterKesatuan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_kesatuan` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `MasterKesatuan_nama_kesatuan_key`(`nama_kesatuan`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MasterPangkat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_pangkat` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `MasterPangkat_nama_pangkat_key`(`nama_pangkat`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Biodata` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_lengkap` VARCHAR(191) NOT NULL,
    `nrp` VARCHAR(191) NOT NULL,
    `jabatan` VARCHAR(191) NOT NULL,
    `masterPangkatId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Soal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kategoriTesId` INTEGER NOT NULL,
    `teks_soal` TEXT NULL,
    `gambar_soal` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PilihanJawaban` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `soalId` INTEGER NOT NULL,
    `teks_pilihan` TEXT NULL,
    `gambar_pilihan` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserTestSession` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `kategoriTesId` INTEGER NOT NULL,
    `noTes` VARCHAR(191) NULL,
    `jenisPengajuan` VARCHAR(191) NULL,
    `startedAt` DATETIME(3) NULL,
    `finishedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserAnswer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userTestSessionId` INTEGER NOT NULL,
    `soalId` INTEGER NOT NULL,
    `pilihanJawabanId` INTEGER NULL,
    `teks_jawaban` VARCHAR(191) NULL,
    `answeredAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HasilTes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userTestSessionId` INTEGER NOT NULL,
    `status` ENUM('MENUNGGU', 'MEMENUHI_SYARAT', 'TIDAK_MEMENUHI_SYARAT') NOT NULL DEFAULT 'MENUNGGU',
    `keterangan` VARCHAR(191) NULL,
    `adminId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WebsiteBackground` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `svg_path` VARCHAR(191) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_id_biodata_fkey` FOREIGN KEY (`id_biodata`) REFERENCES `Biodata`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_masterKesatuanId_fkey` FOREIGN KEY (`masterKesatuanId`) REFERENCES `MasterKesatuan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KategoriTes` ADD CONSTRAINT `KategoriTes_masterJenisTesId_fkey` FOREIGN KEY (`masterJenisTesId`) REFERENCES `MasterJenisTes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Biodata` ADD CONSTRAINT `Biodata_masterPangkatId_fkey` FOREIGN KEY (`masterPangkatId`) REFERENCES `MasterPangkat`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Soal` ADD CONSTRAINT `Soal_kategoriTesId_fkey` FOREIGN KEY (`kategoriTesId`) REFERENCES `KategoriTes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PilihanJawaban` ADD CONSTRAINT `PilihanJawaban_soalId_fkey` FOREIGN KEY (`soalId`) REFERENCES `Soal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserTestSession` ADD CONSTRAINT `UserTestSession_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserTestSession` ADD CONSTRAINT `UserTestSession_kategoriTesId_fkey` FOREIGN KEY (`kategoriTesId`) REFERENCES `KategoriTes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserAnswer` ADD CONSTRAINT `UserAnswer_userTestSessionId_fkey` FOREIGN KEY (`userTestSessionId`) REFERENCES `UserTestSession`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserAnswer` ADD CONSTRAINT `UserAnswer_soalId_fkey` FOREIGN KEY (`soalId`) REFERENCES `Soal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserAnswer` ADD CONSTRAINT `UserAnswer_pilihanJawabanId_fkey` FOREIGN KEY (`pilihanJawabanId`) REFERENCES `PilihanJawaban`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HasilTes` ADD CONSTRAINT `HasilTes_userTestSessionId_fkey` FOREIGN KEY (`userTestSessionId`) REFERENCES `UserTestSession`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HasilTes` ADD CONSTRAINT `HasilTes_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
