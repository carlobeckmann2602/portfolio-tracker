/*
  Warnings:

  - You are about to drop the column `close` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `high` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `low` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `open` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `trend` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the `StocksOnUsers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `portfoliovalue` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "StocksOnUsers" DROP CONSTRAINT "StocksOnUsers_stockId_fkey";

-- DropForeignKey
ALTER TABLE "StocksOnUsers" DROP CONSTRAINT "StocksOnUsers_userId_fkey";

-- AlterTable
ALTER TABLE "Stock" DROP COLUMN "close",
DROP COLUMN "high",
DROP COLUMN "low",
DROP COLUMN "open",
DROP COLUMN "time",
DROP COLUMN "trend";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "portfoliovalue" DOUBLE PRECISION NOT NULL;

-- DropTable
DROP TABLE "StocksOnUsers";

-- CreateTable
CREATE TABLE "StockHistory" (
    "id" INTEGER NOT NULL,
    "stockId" INTEGER NOT NULL,
    "split" DOUBLE PRECISION NOT NULL,
    "open" DOUBLE PRECISION NOT NULL,
    "close" DOUBLE PRECISION NOT NULL,
    "high" DOUBLE PRECISION NOT NULL,
    "low" DOUBLE PRECISION NOT NULL,
    "trend" DOUBLE PRECISION NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StockHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transactions" (
    "id" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "stockId" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "buy" BOOLEAN NOT NULL,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StockHistory" ADD CONSTRAINT "StockHistory_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
