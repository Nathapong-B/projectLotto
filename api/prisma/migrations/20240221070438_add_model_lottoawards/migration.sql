-- CreateTable
CREATE TABLE "LottoAwards" (
    "id" SERIAL NOT NULL,
    "rewardId" INTEGER NOT NULL,
    "lottoId" INTEGER NOT NULL,
    "billSaleId" INTEGER NOT NULL,

    CONSTRAINT "LottoAwards_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LottoAwards" ADD CONSTRAINT "LottoAwards_rewardId_fkey" FOREIGN KEY ("rewardId") REFERENCES "RewardDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LottoAwards" ADD CONSTRAINT "LottoAwards_lottoId_fkey" FOREIGN KEY ("lottoId") REFERENCES "Lotto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LottoAwards" ADD CONSTRAINT "LottoAwards_billSaleId_fkey" FOREIGN KEY ("billSaleId") REFERENCES "BillSale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
