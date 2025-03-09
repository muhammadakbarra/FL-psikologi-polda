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
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `KategoriTes` ADD CONSTRAINT `KategoriTes_masterJenisTesId_fkey` FOREIGN KEY (`masterJenisTesId`) REFERENCES `MasterJenisTes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
