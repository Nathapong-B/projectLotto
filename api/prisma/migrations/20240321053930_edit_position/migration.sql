/*
  Warnings:

  - You are about to drop the column `bannerId` on the `PositionBanner` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PositionBanner" DROP CONSTRAINT "PositionBanner_bannerId_fkey";

-- AlterTable
ALTER TABLE "PositionBanner" DROP COLUMN "bannerId",
ADD COLUMN     "bannerPath" TEXT,
ADD COLUMN     "page" TEXT,
ALTER COLUMN "position" DROP DEFAULT;
