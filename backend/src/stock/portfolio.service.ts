import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Portfolio } from './interfaces/Portfolio';
import { StockGainAndSplitAdjusted } from './interfaces/StockGainAndSplitAdjusted';
import { TransactionAgregationCollection } from './interfaces/transactions/TransactionAgregationCollection';
import { TransactionAgregationCollectionWithStockInfo } from './interfaces/transactions/TransactionAgregationCollectionWithStockInfo';
import { TransactionAgregationData } from './interfaces/transactions/TransactionAgregationData';
import { TransactionAgregationDataWithStockInfo } from './interfaces/transactions/TransactionAgregationDataWithStockInfo';
import { TransactionsGrouped } from './interfaces/transactions/TransactionsGrouped';
import { TransactionSplitAdjusted } from './interfaces/transactions/TransactionSplitAdjusted';
import { SplitService } from './split.service';
import { StockService } from './stock.service';

@Injectable()
export class PortfolioService {
  constructor(private splitService: SplitService, private prisma: PrismaService, private stockService: StockService) {}

  async getGroupedTransactions(uid: number): Promise<TransactionsGrouped> {
    const transactions = await this.splitService.createSplitAdjustedTransactions(uid);

    const groupedTransactions = transactions.reduce(
      (container: TransactionsGrouped, currentTransaction: TransactionSplitAdjusted) => {
        container[currentTransaction.stockId] = container[currentTransaction.stockId] || [];
        container[currentTransaction.stockId].push(currentTransaction);
        return container;
      },
      {},
    );

    return groupedTransactions;
  }

  agregateAllTransactions(groupedTransactions: TransactionsGrouped): TransactionAgregationCollection {
    const transactionAgregationCollection: TransactionAgregationCollection = {};
    for (const stockId in groupedTransactions) {
      const transactions = groupedTransactions[stockId];
      const agregatedTransactions = this.agregateTransactions(transactions);
      transactionAgregationCollection[stockId] = agregatedTransactions;
    }
    return transactionAgregationCollection;
  }

  agregateTransactions(transactions: TransactionSplitAdjusted[]): TransactionAgregationData {
    const agregatedTransactions = transactions.reduce(
      (agregatedTransactions: TransactionAgregationData, transaction) => {
        if (transaction.buy) {
          agregatedTransactions.amountAfterSplit += transaction.amountAfterSplit;
          agregatedTransactions.moneyInvestedInStock += transaction.amount * transaction.price;
        } else if (!transaction.buy) {
          agregatedTransactions.amountAfterSplit -= transaction.amountAfterSplit;
          agregatedTransactions.moneyRecievedFromSales += transaction.amount * transaction.price;
        }
        return agregatedTransactions;
      },
      {
        amountAfterSplit: 0,
        moneyInvestedInStock: 0,
        moneyRecievedFromSales: 0,
      },
    );
    return agregatedTransactions;
  }

  createGainAndSplitAdjustedStock(sid: string, data: TransactionAgregationDataWithStockInfo): StockGainAndSplitAdjusted {
    const currentPrice = data.stockInfo.histories[0]?.close;

    const gainAbsolute =
      data.aggregationData.moneyRecievedFromSales -
      data.aggregationData.moneyInvestedInStock +
      data.aggregationData.amountAfterSplit * currentPrice;
    const gainPercentage =
      ((gainAbsolute - data.aggregationData.moneyInvestedInStock) / data.aggregationData.moneyInvestedInStock) * 100;
    const gainPercentageRounded = Math.round(gainPercentage * 100) / 100;

    return {
      ...data.stockInfo,
      amountAfterSplit: data.aggregationData.amountAfterSplit,
      price: currentPrice,
      trend: data.stockInfo.histories[0]?.trend,
      moneyInvestedInStock: data.aggregationData.moneyInvestedInStock,
      gainAbsolute: gainAbsolute,
      gainPercentage: gainPercentageRounded,
    };
  }

  async getPortfolioData(uid: number): Promise<Portfolio> {
    const groupedTransactions = await this.getGroupedTransactions(uid);
    const transactionAgregationCollection = this.agregateAllTransactions(groupedTransactions);
    const gainAndSplitAdjustedStocks: StockGainAndSplitAdjusted[] = [];

    let currentPortfolioValue = 0;
    let gainAbsolutePortfolio = 0;
    let moneyInvestedPortfolio = 0;

    const getStocskWithHistory = await this.stockService.getStocskWithHistory(
      Object.keys(transactionAgregationCollection).map((key) => Number(key)),
      30,
    );

    const transactionAgregationCollectionWithStockInfo: TransactionAgregationCollectionWithStockInfo = {};

    for (const [stockId, transactionAgregationData] of Object.entries(transactionAgregationCollection)) {
      transactionAgregationCollectionWithStockInfo[Number(stockId)] = {
        aggregationData: transactionAgregationData,
        stockInfo: getStocskWithHistory.find((stock) => stock.id === Number(stockId)),
      };
    }

    for (const stockId in transactionAgregationCollectionWithStockInfo) {
      const info = transactionAgregationCollectionWithStockInfo[stockId];
      const gainAndSplitAdjustedStock = this.createGainAndSplitAdjustedStock(stockId, info);

      gainAndSplitAdjustedStocks.push(gainAndSplitAdjustedStock);

      currentPortfolioValue += gainAndSplitAdjustedStock.amountAfterSplit * gainAndSplitAdjustedStock.price;
      gainAbsolutePortfolio += gainAndSplitAdjustedStock.gainAbsolute;
      moneyInvestedPortfolio += gainAndSplitAdjustedStock.moneyInvestedInStock;
    }

    const gainPercentagePortfolio = ((gainAbsolutePortfolio - moneyInvestedPortfolio) / moneyInvestedPortfolio) * 100;
    const gainPercentagePortfolioRounded = Math.round(gainPercentagePortfolio * 100) / 100;
    const portfolio: Portfolio = {
      currentPortfolioValue: currentPortfolioValue,
      gainAbsolute: gainAbsolutePortfolio,
      gainPercentage: gainPercentagePortfolioRounded,
      stocks: gainAndSplitAdjustedStocks,
    };

    return portfolio;
  }
}
