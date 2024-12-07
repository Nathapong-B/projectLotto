/*
  Warnings:

  - You are about to drop the column `quantity` on the `Lotto` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Lotto" DROP COLUMN "quantity",
ADD COLUMN     "stock" INTEGER NOT NULL DEFAULT 0;
