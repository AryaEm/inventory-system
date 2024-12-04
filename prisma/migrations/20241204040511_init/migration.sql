/*
  Warnings:

  - You are about to alter the column `location` on the `item` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `item` ADD COLUMN `status` ENUM('Tersedia', 'Kosong') NOT NULL DEFAULT 'Tersedia',
    MODIFY `location` VARCHAR(191) NOT NULL DEFAULT '';
