-- CreateTable
CREATE TABLE `MasterKesatuan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_kesatuan` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `MasterKesatuan_nama_kesatuan_key`(`nama_kesatuan`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MasterPangkat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_pangkat` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `MasterPangkat_nama_pangkat_key`(`nama_pangkat`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
