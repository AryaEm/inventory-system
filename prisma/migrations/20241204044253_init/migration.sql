/*
  Warnings:

  - Added the required column `maximum_borrowing` to the `Detail_peminjaman` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `detail_peminjaman` ADD COLUMN `maximum_borrowing` DATETIME(3) NOT NULL;
