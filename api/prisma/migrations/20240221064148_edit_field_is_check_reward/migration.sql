/*
  Warnings:

  - You are about to drop the column `reward` on the `Lotto` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Lotto" DROP COLUMN "reward",
ADD COLUMN     "isCheckReward" TEXT;
