/*
  Warnings:

  - You are about to drop the column `billSaleId` on the `LottoAwards` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "LottoAwards" DROP CONSTRAINT "LottoAwards_billSaleId_fkey";

-- AlterTable
ALTER TABLE "LottoAwards" DROP COLUMN "billSaleId",
ADD COLUMN     "billDetailId" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "LottoAwards" ADD CONSTRAINT "LottoAwards_billDetailId_fkey" FOREIGN KEY ("billDetailId") REFERENCES "BillSaleDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
