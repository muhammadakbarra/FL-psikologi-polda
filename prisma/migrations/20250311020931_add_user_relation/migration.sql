-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_id_biodata_fkey` FOREIGN KEY (`id_biodata`) REFERENCES `Biodata`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
