-- AlterTable
ALTER TABLE "BillSale" ADD COLUMN     "confirmState" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "payTime" TEXT;
