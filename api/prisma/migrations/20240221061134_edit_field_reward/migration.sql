/*
  Warnings:

  - You are about to drop the column `remark` on the `Lotto` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Lotto" DROP COLUMN "remark",
ADD COLUMN     "reward" TEXT;
