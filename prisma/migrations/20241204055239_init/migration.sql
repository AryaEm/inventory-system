/*
  Warnings:

  - You are about to drop the column `itemId` on the `peminjaman` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `peminjaman` table. All the data in the column will be lost.
  - Added the required column `item_id` to the `Peminjaman` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Peminjaman` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `peminjaman` DROP FOREIGN KEY `Peminjaman_itemId_fkey`;

-- DropForeignKey
ALTER TABLE `peminjaman` DROP FOREIGN KEY `Peminjaman_userId_fkey`;

-- AlterTable
ALTER TABLE `peminjaman` DROP COLUMN `itemId`,
    DROP COLUMN `userId`,
    ADD COLUMN `item_id` INTEGER NOT NULL,
    ADD COLUMN `user_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Peminjaman` ADD CONSTRAINT `Peminjaman_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Peminjaman` ADD CONSTRAINT `Peminjaman_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `Item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
