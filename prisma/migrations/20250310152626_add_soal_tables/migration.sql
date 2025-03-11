-- CreateTable
CREATE TABLE `Soal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kategoriTesId` INTEGER NOT NULL,
    `teks_soal` TEXT NOT NULL,
    `gambar_soal` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PilihanJawaban` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `soalId` INTEGER NOT NULL,
    `teks_pilihan` TEXT NULL,
    `gambar_pilihan` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Soal` ADD CONSTRAINT `Soal_kategoriTesId_fkey` FOREIGN KEY (`kategoriTesId`) REFERENCES `KategoriTes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PilihanJawaban` ADD CONSTRAINT `PilihanJawaban_soalId_fkey` FOREIGN KEY (`soalId`) REFERENCES `Soal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
