/*
  Warnings:

  - You are about to drop the column `quantity` on the `BillSaleDetail` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BillSaleDetail" DROP COLUMN "quantity",
ADD COLUMN     "Qty" INTEGER NOT NULL DEFAULT 0;
