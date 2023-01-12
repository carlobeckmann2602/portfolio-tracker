import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Portfolio } from './interfaces/Portfolio';
import { StockGainAndSplitAdjusted } from './interfaces/StockGainAndSplitAdjusted';
import { TransactionAgregationCollection } from './interfaces/transactions/TransactionAgregationCollection';
import { TransactionAgregationData } from './interfaces/transactions/TransactionAgregationData';
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

  async createGainAndSplitAdjustedStock(
    sid: number,
    transactionAgregationData: TransactionAgregationData,
  ): Promise<StockGainAndSplitAdjusted> {
    const stock = await this.prisma.stock.findFirst({ where: { id: Number(sid) } });

    const stockHistory = (await this.stockService.getStockWithHistory(Number(sid), 30)).histories;
    if (!stockHistory[0]) {
      throw `No data available for stock with id ${sid}`;
    }

    const currentPrice = stockHistory[0].close;

    const gainAbsolute =
      transactionAgregationData.moneyRecievedFromSales -
      transactionAgregationData.moneyInvestedInStock +
      transactionAgregationData.amountAfterSplit * currentPrice;
    const gainPercentage =
      ((gainAbsolute - transactionAgregationData.moneyInvestedInStock) / transactionAgregationData.moneyInvestedInStock) * 100;
    const gainPercentageRounded = Math.round(gainPercentage * 100) / 100;
    return {
      ...stock,
      amountAfterSplit: transactionAgregationData.amountAfterSplit,
      price: currentPrice,
      trend: stockHistory[0].trend,
      moneyInvestedInStock: transactionAgregationData.moneyInvestedInStock,
      gainAbsolute: gainAbsolute,
      gainPercentage: gainPercentageRounded,
      histories: stockHistory,
    };
  }

  async getPortfolioData(uid: number): Promise<Portfolio> {
    const groupedTransactions = await this.getGroupedTransactions(uid);
    const transactionAgregationCollection = this.agregateAllTransactions(groupedTransactions);
    const gainAndSplitAdjustedStocks: StockGainAndSplitAdjusted[] = [];

    let currentPortfolioValue = 0;
    let gainAbsolutePortfolio = 0;
    let moneyInvestedPortfolio = 0;

    for (const stockId in transactionAgregationCollection) {
      const gainAndSplitAdjustedStock = await this.createGainAndSplitAdjustedStock(
        Number(stockId),
        transactionAgregationCollection[stockId],
      );
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
