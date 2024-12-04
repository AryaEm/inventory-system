/*
  Warnings:

  - You are about to drop the column `item_id` on the `peminjaman` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `peminjaman` table. All the data in the column will be lost.
  - Added the required column `itemId` to the `Peminjaman` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Peminjaman` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `peminjaman` DROP FOREIGN KEY `Peminjaman_item_id_fkey`;

-- DropForeignKey
ALTER TABLE `peminjaman` DROP FOREIGN KEY `Peminjaman_user_id_fkey`;

-- AlterTable
ALTER TABLE `peminjaman` DROP COLUMN `item_id`,
    DROP COLUMN `user_id`,
    ADD COLUMN `itemId` INTEGER NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Peminjaman` ADD CONSTRAINT `Peminjaman_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Peminjaman` ADD CONSTRAINT `Peminjaman_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `Item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
