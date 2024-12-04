/*
  Warnings:

  - You are about to drop the column `borrowDate` on the `peminjaman` table. All the data in the column will be lost.
  - You are about to drop the column `returnDate` on the `peminjaman` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `peminjaman` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `peminjaman` table. All the data in the column will be lost.
  - You are about to drop the `detail_peminjaman` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `borrow_date` to the `Peminjaman` table without a default value. This is not possible if the table is not empty.
  - Added the required column `item_id` to the `Peminjaman` table without a default value. This is not possible if the table is not empty.
  - Added the required column `return_date` to the `Peminjaman` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Peminjaman` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Peminjaman` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `detail_peminjaman` DROP FOREIGN KEY `Detail_peminjaman_itemId_fkey`;

-- DropForeignKey
ALTER TABLE `detail_peminjaman` DROP FOREIGN KEY `Detail_peminjaman_peminjamanId_fkey`;

-- DropForeignKey
ALTER TABLE `peminjaman` DROP FOREIGN KEY `Peminjaman_userId_fkey`;

-- AlterTable
ALTER TABLE `peminjaman` DROP COLUMN `borrowDate`,
    DROP COLUMN `returnDate`,
    DROP COLUMN `updateAt`,
    DROP COLUMN `userId`,
    ADD COLUMN `borrow_date` DATETIME(3) NOT NULL,
    ADD COLUMN `item_id` INTEGER NOT NULL,
    ADD COLUMN `return_date` DATETIME(3) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `user_id` INTEGER NOT NULL;

-- DropTable
DROP TABLE `detail_peminjaman`;

-- AddForeignKey
ALTER TABLE `Peminjaman` ADD CONSTRAINT `Peminjaman_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Peminjaman` ADD CONSTRAINT `Peminjaman_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `Item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
