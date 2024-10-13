/*
  Warnings:

  - You are about to drop the column `imgageURL` on the `Food` table. All the data in the column will be lost.
  - Added the required column `imageURL` to the `Food` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Food` DROP COLUMN `imgageURL`,
    ADD COLUMN `imageURL` VARCHAR(191) NOT NULL;
