/*
  Warnings:

  - You are about to drop the `kategorites` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `masterjenistes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `masterkesatuan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `masterpangkat` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `biodata` DROP FOREIGN KEY `Biodata_masterPangkatId_fkey`;

-- DropForeignKey
ALTER TABLE `kategorites` DROP FOREIGN KEY `KategoriTes_masterJenisTesId_fkey`;

-- DropForeignKey
ALTER TABLE `soal` DROP FOREIGN KEY `Soal_kategoriTesId_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_masterKesatuanId_fkey`;

-- DropForeignKey
ALTER TABLE `usertestsession` DROP FOREIGN KEY `UserTestSession_kategoriTesId_fkey`;

-- DropTable
DROP TABLE `kategorites`;

-- DropTable
DROP TABLE `masterjenistes`;

-- DropTable
DROP TABLE `masterkesatuan`;

-- DropTable
DROP TABLE `masterpangkat`;

-- CreateTable
CREATE TABLE `kategoriTes` (
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
CREATE TABLE `masterJenisTes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_jenis_tes` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `MasterJenisTes_nama_jenis_tes_key`(`nama_jenis_tes`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `masterKesatuan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_kesatuan` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `MasterKesatuan_nama_kesatuan_key`(`nama_kesatuan`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `masterPangkat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_pangkat` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `MasterPangkat_nama_pangkat_key`(`nama_pangkat`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `biodata` ADD CONSTRAINT `Biodata_masterPangkatId_fkey` FOREIGN KEY (`masterPangkatId`) REFERENCES `masterPangkat`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kategoriTes` ADD CONSTRAINT `KategoriTes_masterJenisTesId_fkey` FOREIGN KEY (`masterJenisTesId`) REFERENCES `masterJenisTes`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `soal` ADD CONSTRAINT `Soal_kategoriTesId_fkey` FOREIGN KEY (`kategoriTesId`) REFERENCES `kategoriTes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `User_masterKesatuanId_fkey` FOREIGN KEY (`masterKesatuanId`) REFERENCES `masterKesatuan`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usertestsession` ADD CONSTRAINT `UserTestSession_kategoriTesId_fkey` FOREIGN KEY (`kategoriTesId`) REFERENCES `kategoriTes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
