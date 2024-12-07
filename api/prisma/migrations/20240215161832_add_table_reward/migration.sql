-- CreateTable
CREATE TABLE "RewardDetail" (
    "id" SERIAL NOT NULL,
    "level" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "reward" INTEGER NOT NULL,
    "date" TEXT NOT NULL,

    CONSTRAINT "RewardDetail_pkey" PRIMARY KEY ("id")
);
