-- CreateTable
CREATE TABLE "FxqlEntry" (
    "entryId" SERIAL NOT NULL,
    "sourceCurrency" TEXT NOT NULL,
    "destinationCurrency" TEXT NOT NULL,
    "buyPrice" DECIMAL(65,30) NOT NULL,
    "sellPrice" DECIMAL(65,30) NOT NULL,
    "capAmount" DECIMAL(65,30) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FxqlEntry_pkey" PRIMARY KEY ("entryId")
);

-- CreateIndex
CREATE UNIQUE INDEX "FxqlEntry_sourceCurrency_destinationCurrency_key" ON "FxqlEntry"("sourceCurrency", "destinationCurrency");
