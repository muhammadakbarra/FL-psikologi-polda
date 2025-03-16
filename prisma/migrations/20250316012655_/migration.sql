/*
  Warnings:

  - You are about to drop the column `masterKesatuanId` on the `Biodata` table. All the data in the column will be lost.
  - Added the required column `masterKesatuanId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Biodata` DROP FOREIGN KEY `Biodata_masterKesatuanId_fkey`;

-- DropIndex
DROP INDEX `Biodata_masterKesatuanId_fkey` ON `Biodata`;

-- AlterTable
ALTER TABLE `Biodata` DROP COLUMN `masterKesatuanId`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `masterKesatuanId` INTEGER NOT NULL,
    ADD COLUMN `nama_kota` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_masterKesatuanId_fkey` FOREIGN KEY (`masterKesatuanId`) REFERENCES `MasterKesatuan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
