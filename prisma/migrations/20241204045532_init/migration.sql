/*
  Warnings:

  - You are about to drop the column `borrowDate` on the `detail_peminjaman` table. All the data in the column will be lost.
  - You are about to drop the column `maximum_borrowing` on the `detail_peminjaman` table. All the data in the column will be lost.
  - You are about to drop the column `returnDate` on the `detail_peminjaman` table. All the data in the column will be lost.
  - You are about to drop the column `uuid` on the `detail_peminjaman` table. All the data in the column will be lost.
  - You are about to drop the column `uuid` on the `peminjaman` table. All the data in the column will be lost.
  - Added the required column `borrowDate` to the `Peminjaman` table without a default value. This is not possible if the table is not empty.
  - Added the required column `returnDate` to the `Peminjaman` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `detail_peminjaman` DROP COLUMN `borrowDate`,
    DROP COLUMN `maximum_borrowing`,
    DROP COLUMN `returnDate`,
    DROP COLUMN `uuid`;

-- AlterTable
ALTER TABLE `peminjaman` DROP COLUMN `uuid`,
    ADD COLUMN `borrowDate` DATETIME(3) NOT NULL,
    ADD COLUMN `returnDate` DATETIME(3) NOT NULL;
