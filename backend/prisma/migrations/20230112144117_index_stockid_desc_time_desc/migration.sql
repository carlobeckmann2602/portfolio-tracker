-- CreateIndex
CREATE INDEX "StockHistory_stockId_time_idx" ON "StockHistory"("stockId" DESC, "time" DESC);
