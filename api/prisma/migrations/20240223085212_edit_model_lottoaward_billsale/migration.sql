/*
  Warnings:

  - Added the required column `billSaleId` to the `LottoAwards` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BillSale" ADD COLUMN     "reward" TEXT NOT NULL DEFAULT 'false';

-- AlterTable
ALTER TABLE "LottoAwards" ADD COLUMN     "billSaleId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "LottoAwards" ADD CONSTRAINT "LottoAwards_billSaleId_fkey" FOREIGN KEY ("billSaleId") REFERENCES "BillSale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
