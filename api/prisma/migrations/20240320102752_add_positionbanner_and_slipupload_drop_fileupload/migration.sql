/*
  Warnings:

  - You are about to drop the `FileUpload` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "FileUpload";

-- CreateTable
CREATE TABLE "SlipUpload" (
    "id" SERIAL NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "src" TEXT NOT NULL,
    "type" TEXT,
    "size" INTEGER DEFAULT 0,
    "billSaleId" INTEGER NOT NULL,

    CONSTRAINT "SlipUpload_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PositionBanner" (
    "id" SERIAL NOT NULL,
    "position" TEXT DEFAULT '0',
    "bannerId" INTEGER NOT NULL,
    "expDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PositionBanner_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SlipUpload" ADD CONSTRAINT "SlipUpload_billSaleId_fkey" FOREIGN KEY ("billSaleId") REFERENCES "BillSale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PositionBanner" ADD CONSTRAINT "PositionBanner_bannerId_fkey" FOREIGN KEY ("bannerId") REFERENCES "Banner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
