/*
  Warnings:

  - Added the required column `borrowDate` to the `Detail_peminjaman` table without a default value. This is not possible if the table is not empty.
  - Added the required column `returnDate` to the `Detail_peminjaman` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `detail_peminjaman` ADD COLUMN `borrowDate` DATETIME(3) NOT NULL,
    ADD COLUMN `itemId` INTEGER NULL,
    ADD COLUMN `peminjamanId` INTEGER NULL,
    ADD COLUMN `returnDate` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `peminjaman` ADD COLUMN `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Peminjaman` ADD CONSTRAINT `Peminjaman_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Detail_peminjaman` ADD CONSTRAINT `Detail_peminjaman_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `Item`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Detail_peminjaman` ADD CONSTRAINT `Detail_peminjaman_peminjamanId_fkey` FOREIGN KEY (`peminjamanId`) REFERENCES `Peminjaman`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
