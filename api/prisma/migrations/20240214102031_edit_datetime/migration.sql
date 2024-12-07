/*
  Warnings:

  - You are about to drop the column `payTime` on the `BillSale` table. All the data in the column will be lost.
  - The `payDate` column on the `BillSale` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "BillSale" DROP COLUMN "payTime",
DROP COLUMN "payDate",
ADD COLUMN     "payDate" TIMESTAMP(3);
