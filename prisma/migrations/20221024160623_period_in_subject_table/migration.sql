/*
  Warnings:

  - You are about to drop the column `duration_in_months` on the `Subject` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Subject` DROP COLUMN `duration_in_months`,
    ADD COLUMN `period` ENUM('first_semester', 'second_semester', 'annually') NOT NULL DEFAULT 'annually';
