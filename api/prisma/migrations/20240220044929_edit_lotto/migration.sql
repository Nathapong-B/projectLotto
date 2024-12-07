/*
  Warnings:

  - You are about to drop the column `roundNumber` on the `Lotto` table. All the data in the column will be lost.
  - Made the column `roundDate` on table `Lotto` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Lotto" DROP COLUMN "roundNumber",
ALTER COLUMN "roundDate" SET NOT NULL;
