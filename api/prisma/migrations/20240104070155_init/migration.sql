/*
  Warnings:

  - You are about to drop the column `name` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `Lotto` table. All the data in the column will be lost.
  - Added the required column `c_name` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `l_number` to the `Lotto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "name",
ADD COLUMN     "c_name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Lotto" DROP COLUMN "number",
ADD COLUMN     "l_number" TEXT NOT NULL;
