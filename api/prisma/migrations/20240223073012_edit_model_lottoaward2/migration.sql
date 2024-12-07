/*
  Warnings:

  - You are about to drop the column `billDetailId` on the `LottoAwards` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[billSaleDetailId]` on the table `LottoAwards` will be added. If there are existing duplicate values, this will fail.
  - Made the column `sale` on table `BillSaleDetail` required. This step will fail if there are existing NULL values in that column.
  - Made the column `isCheckReward` on table `Lotto` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `billSaleDetailId` to the `LottoAwards` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LottoAwards" DROP CONSTRAINT "LottoAwards_billDetailId_fkey";

-- AlterTable
ALTER TABLE "BillSaleDetail" ALTER COLUMN "sale" SET NOT NULL;

-- AlterTable
ALTER TABLE "Lotto" ALTER COLUMN "isCheckReward" SET NOT NULL;

-- AlterTable
ALTER TABLE "LottoAwards" DROP COLUMN "billDetailId",
ADD COLUMN     "billSaleDetailId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "LottoAwards_billSaleDetailId_key" ON "LottoAwards"("billSaleDetailId");

-- AddForeignKey
ALTER TABLE "LottoAwards" ADD CONSTRAINT "LottoAwards_billSaleDetailId_fkey" FOREIGN KEY ("billSaleDetailId") REFERENCES "BillSaleDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
