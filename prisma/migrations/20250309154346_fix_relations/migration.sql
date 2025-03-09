-- CreateTable
CREATE TABLE `Biodata` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_lengkap` VARCHAR(191) NOT NULL,
    `nrp` VARCHAR(191) NOT NULL,
    `jabatan` VARCHAR(191) NOT NULL,
    `masterKesatuanId` INTEGER NOT NULL,
    `masterPangkatId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Biodata` ADD CONSTRAINT `Biodata_masterKesatuanId_fkey` FOREIGN KEY (`masterKesatuanId`) REFERENCES `MasterKesatuan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Biodata` ADD CONSTRAINT `Biodata_masterPangkatId_fkey` FOREIGN KEY (`masterPangkatId`) REFERENCES `MasterPangkat`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
