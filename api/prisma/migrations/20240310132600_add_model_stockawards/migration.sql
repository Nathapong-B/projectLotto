-- CreateTable
CREATE TABLE "StockAwards" (
    "id" SERIAL NOT NULL,
    "rewardId" INTEGER NOT NULL,
    "lottoId" INTEGER NOT NULL,

    CONSTRAINT "StockAwards_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StockAwards" ADD CONSTRAINT "StockAwards_rewardId_fkey" FOREIGN KEY ("rewardId") REFERENCES "RewardDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockAwards" ADD CONSTRAINT "StockAwards_lottoId_fkey" FOREIGN KEY ("lottoId") REFERENCES "Lotto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
