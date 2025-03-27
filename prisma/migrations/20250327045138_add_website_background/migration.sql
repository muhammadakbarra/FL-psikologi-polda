-- DropForeignKey
ALTER TABLE `PilihanJawaban` DROP FOREIGN KEY `PilihanJawaban_soalId_fkey`;

-- DropForeignKey
ALTER TABLE `Soal` DROP FOREIGN KEY `Soal_kategoriTesId_fkey`;

-- DropForeignKey
ALTER TABLE `UserAnswer` DROP FOREIGN KEY `UserAnswer_pilihanJawabanId_fkey`;

-- DropForeignKey
ALTER TABLE `UserAnswer` DROP FOREIGN KEY `UserAnswer_soalId_fkey`;

-- DropForeignKey
ALTER TABLE `UserTestSession` DROP FOREIGN KEY `UserTestSession_kategoriTesId_fkey`;

-- DropIndex
DROP INDEX `PilihanJawaban_soalId_fkey` ON `PilihanJawaban`;

-- DropIndex
DROP INDEX `Soal_kategoriTesId_fkey` ON `Soal`;

-- DropIndex
DROP INDEX `UserAnswer_pilihanJawabanId_fkey` ON `UserAnswer`;

-- DropIndex
DROP INDEX `UserAnswer_soalId_fkey` ON `UserAnswer`;

-- DropIndex
DROP INDEX `UserTestSession_kategoriTesId_fkey` ON `UserTestSession`;

-- AlterTable
ALTER TABLE `Biodata` MODIFY `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `HasilTes` MODIFY `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `KategoriTes` MODIFY `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `MasterKesatuan` MODIFY `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `MasterPangkat` MODIFY `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `PilihanJawaban` MODIFY `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `Soal` MODIFY `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `UserAnswer` MODIFY `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `UserTestSession` MODIFY `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

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
ALTER TABLE `Soal` ADD CONSTRAINT `Soal_kategoriTesId_fkey` FOREIGN KEY (`kategoriTesId`) REFERENCES `KategoriTes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PilihanJawaban` ADD CONSTRAINT `PilihanJawaban_soalId_fkey` FOREIGN KEY (`soalId`) REFERENCES `Soal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserTestSession` ADD CONSTRAINT `UserTestSession_kategoriTesId_fkey` FOREIGN KEY (`kategoriTesId`) REFERENCES `KategoriTes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserAnswer` ADD CONSTRAINT `UserAnswer_soalId_fkey` FOREIGN KEY (`soalId`) REFERENCES `Soal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserAnswer` ADD CONSTRAINT `UserAnswer_pilihanJawabanId_fkey` FOREIGN KEY (`pilihanJawabanId`) REFERENCES `PilihanJawaban`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
