/*
  Warnings:

  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Biodata` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HasilTes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `KategoriTes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MasterJenisTes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MasterKesatuan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MasterPangkat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PilihanJawaban` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Soal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserAnswer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserTestSession` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WebsiteBackground` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Biodata` DROP FOREIGN KEY `Biodata_masterPangkatId_fkey`;

-- DropForeignKey
ALTER TABLE `HasilTes` DROP FOREIGN KEY `HasilTes_adminId_fkey`;

-- DropForeignKey
ALTER TABLE `HasilTes` DROP FOREIGN KEY `HasilTes_userTestSessionId_fkey`;

-- DropForeignKey
ALTER TABLE `KategoriTes` DROP FOREIGN KEY `KategoriTes_masterJenisTesId_fkey`;

-- DropForeignKey
ALTER TABLE `PilihanJawaban` DROP FOREIGN KEY `PilihanJawaban_soalId_fkey`;

-- DropForeignKey
ALTER TABLE `Soal` DROP FOREIGN KEY `Soal_kategoriTesId_fkey`;

-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_id_biodata_fkey`;

-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_masterKesatuanId_fkey`;

-- DropForeignKey
ALTER TABLE `UserAnswer` DROP FOREIGN KEY `UserAnswer_pilihanJawabanId_fkey`;

-- DropForeignKey
ALTER TABLE `UserAnswer` DROP FOREIGN KEY `UserAnswer_soalId_fkey`;

-- DropForeignKey
ALTER TABLE `UserAnswer` DROP FOREIGN KEY `UserAnswer_userTestSessionId_fkey`;

-- DropForeignKey
ALTER TABLE `UserTestSession` DROP FOREIGN KEY `UserTestSession_kategoriTesId_fkey`;

-- DropForeignKey
ALTER TABLE `UserTestSession` DROP FOREIGN KEY `UserTestSession_userId_fkey`;

-- DropTable
DROP TABLE `Admin`;

-- DropTable
DROP TABLE `Biodata`;

-- DropTable
DROP TABLE `HasilTes`;

-- DropTable
DROP TABLE `KategoriTes`;

-- DropTable
DROP TABLE `MasterJenisTes`;

-- DropTable
DROP TABLE `MasterKesatuan`;

-- DropTable
DROP TABLE `MasterPangkat`;

-- DropTable
DROP TABLE `PilihanJawaban`;

-- DropTable
DROP TABLE `Soal`;

-- DropTable
DROP TABLE `User`;

-- DropTable
DROP TABLE `UserAnswer`;

-- DropTable
DROP TABLE `UserTestSession`;

-- DropTable
DROP TABLE `WebsiteBackground`;

-- CreateTable
CREATE TABLE `admin` (
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
CREATE TABLE `biodata` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_lengkap` VARCHAR(191) NOT NULL,
    `nrp` VARCHAR(191) NOT NULL,
    `jabatan` VARCHAR(191) NOT NULL,
    `masterPangkatId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Biodata_masterPangkatId_fkey`(`masterPangkatId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hasiltes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userTestSessionId` INTEGER NOT NULL,
    `status` ENUM('MENUNGGU', 'MEMENUHI_SYARAT', 'TIDAK_MEMENUHI_SYARAT') NOT NULL DEFAULT 'MENUNGGU',
    `keterangan` VARCHAR(191) NULL,
    `adminId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `masa_berlaku` VARCHAR(191) NULL,

    INDEX `HasilTes_adminId_fkey`(`adminId`),
    INDEX `HasilTes_userTestSessionId_fkey`(`userTestSessionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kategorites` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_kategori_tes` VARCHAR(191) NOT NULL,
    `masterJenisTesId` INTEGER NOT NULL,
    `waktu_pengerjaan` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `instruksi_tes` TEXT NULL,

    INDEX `KategoriTes_masterJenisTesId_fkey`(`masterJenisTesId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `masterjenistes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_jenis_tes` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `MasterJenisTes_nama_jenis_tes_key`(`nama_jenis_tes`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `masterkesatuan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_kesatuan` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `MasterKesatuan_nama_kesatuan_key`(`nama_kesatuan`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `masterpangkat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_pangkat` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `MasterPangkat_nama_pangkat_key`(`nama_pangkat`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pilihanjawaban` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `soalId` INTEGER NOT NULL,
    `teks_pilihan` TEXT NULL,
    `gambar_pilihan` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `PilihanJawaban_soalId_fkey`(`soalId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `soal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kategoriTesId` INTEGER NOT NULL,
    `teks_soal` TEXT NULL,
    `gambar_soal` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Soal_kategoriTesId_fkey`(`kategoriTesId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `id_biodata` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `masterKesatuanId` INTEGER NOT NULL,
    `nama_kota` VARCHAR(191) NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    INDEX `User_id_biodata_fkey`(`id_biodata`),
    INDEX `User_masterKesatuanId_fkey`(`masterKesatuanId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `useranswer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userTestSessionId` INTEGER NOT NULL,
    `soalId` INTEGER NOT NULL,
    `pilihanJawabanId` INTEGER NULL,
    `teks_jawaban` VARCHAR(191) NULL,
    `answeredAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `UserAnswer_pilihanJawabanId_fkey`(`pilihanJawabanId`),
    INDEX `UserAnswer_soalId_fkey`(`soalId`),
    INDEX `UserAnswer_userTestSessionId_fkey`(`userTestSessionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usertestsession` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `kategoriTesId` INTEGER NOT NULL,
    `noTes` VARCHAR(191) NULL,
    `jenisPengajuan` VARCHAR(191) NULL,
    `startedAt` DATETIME(3) NULL,
    `finishedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `UserTestSession_kategoriTesId_fkey`(`kategoriTesId`),
    INDEX `UserTestSession_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `websitebackground` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `svg_path` VARCHAR(191) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `biodata` ADD CONSTRAINT `Biodata_masterPangkatId_fkey` FOREIGN KEY (`masterPangkatId`) REFERENCES `masterpangkat`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hasiltes` ADD CONSTRAINT `HasilTes_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hasiltes` ADD CONSTRAINT `HasilTes_userTestSessionId_fkey` FOREIGN KEY (`userTestSessionId`) REFERENCES `usertestsession`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kategorites` ADD CONSTRAINT `KategoriTes_masterJenisTesId_fkey` FOREIGN KEY (`masterJenisTesId`) REFERENCES `masterjenistes`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pilihanjawaban` ADD CONSTRAINT `PilihanJawaban_soalId_fkey` FOREIGN KEY (`soalId`) REFERENCES `soal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `soal` ADD CONSTRAINT `Soal_kategoriTesId_fkey` FOREIGN KEY (`kategoriTesId`) REFERENCES `kategorites`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `User_id_biodata_fkey` FOREIGN KEY (`id_biodata`) REFERENCES `biodata`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `User_masterKesatuanId_fkey` FOREIGN KEY (`masterKesatuanId`) REFERENCES `masterkesatuan`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `useranswer` ADD CONSTRAINT `UserAnswer_pilihanJawabanId_fkey` FOREIGN KEY (`pilihanJawabanId`) REFERENCES `pilihanjawaban`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `useranswer` ADD CONSTRAINT `UserAnswer_soalId_fkey` FOREIGN KEY (`soalId`) REFERENCES `soal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `useranswer` ADD CONSTRAINT `UserAnswer_userTestSessionId_fkey` FOREIGN KEY (`userTestSessionId`) REFERENCES `usertestsession`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usertestsession` ADD CONSTRAINT `UserTestSession_kategoriTesId_fkey` FOREIGN KEY (`kategoriTesId`) REFERENCES `kategorites`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usertestsession` ADD CONSTRAINT `UserTestSession_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
