import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Portfolio } from "./interfaces/Portfolio";
import { StockGainAndSplitAdjusted } from "./interfaces/StockGainAndSplitAdjusted";
import { TransactionAgregationData } from "./interfaces/transactions/TransactionAgregationData";
import { TransactionGainAndSplitAdjusted } from "./interfaces/transactions/TransactionGainAndSplitAdjusted";
import { TransactionsAgregationData } from "./interfaces/transactions/TransactionsAgregationData";
import { TransactionsGrouped } from "./interfaces/transactions/TransactionsGrouped";
import { Splitservice } from "./split.service";
import { StockService } from "./stock.service";


@Injectable()
export class PortfolioService {
    constructor(private splitService: Splitservice, private prisma: PrismaService, private stockService: StockService) { }

    async getGroupedTransactions(data: { uid: number, sid?: number }): Promise<TransactionsGrouped> {
        const transactions = await this.splitService.createSplitAdjustedTransactions(data.uid)

        const groupedTransactions =
            transactions.reduce((container: TransactionsGrouped, currentTransaction: TransactionGainAndSplitAdjusted) => {
                if (data.sid || data.sid !== currentTransaction.stockId) {
                    container[currentTransaction.stockId] = container[currentTransaction.stockId] || []
                    container[currentTransaction.stockId].push(currentTransaction);
                }
                return container;
            }, {})

        return groupedTransactions;
    }


    agregateTransactions(groupedTransactions: TransactionsGrouped): TransactionsAgregationData {
        const agregatedTransactionsContainer: TransactionsAgregationData = {}
        for (const stockId in groupedTransactions) {
            const transactions = groupedTransactions[stockId]

            const agregatedTransactions =
                transactions.reduce((agregatedTransactions: TransactionAgregationData, transaction) => {
                    if (transaction.buy) {
                        agregatedTransactions.amountAfterSplit += transaction.amountAfterSplit;
                        agregatedTransactions.moneyInvestedInStock += transaction.amount * transaction.price;
                    } else if (!transaction.buy) {
                        agregatedTransactions.amountAfterSplit -= transaction.amountAfterSplit;
                        agregatedTransactions.moneyRecievedFromSales += transaction.amount * transaction.price;
                    }
                    return agregatedTransactions;
                }, {
                    amountAfterSplit: 0,
                    moneyInvestedInStock: 0,
                    moneyRecievedFromSales: 0
                })

            agregatedTransactionsContainer[stockId] = agregatedTransactions;
        }
        return agregatedTransactionsContainer;
    }


    async getPortfolioData(uid: number): Promise<Portfolio> {

        const groupedTransactions = await this.getGroupedTransactions({ uid })
        const agregatedTransactions = this.agregateTransactions(groupedTransactions)
        const gainAndSplitAdjustedStocks: StockGainAndSplitAdjusted[] = []

        let currentPortfolioValue = 0;
        let gainAbsolutePortfolio = 0;
        let moneyInvestedPortfolio = 0;

        for (const stockId in agregatedTransactions) {
            const agregatedTransactionData = agregatedTransactions[stockId]

            const stock = await this.prisma.stock.findFirst({ where: { id: Number(stockId) } })

            const stockHistory = (await this.stockService.getStockWithHistory(Number(stockId), 30)).histories;
            const currentPrice = stockHistory[0].close

            const gainAbsolute = agregatedTransactionData.moneyRecievedFromSales - agregatedTransactionData.moneyInvestedInStock
                + (agregatedTransactionData.amountAfterSplit * currentPrice);
            const gainPercentage = (gainAbsolute - agregatedTransactionData.moneyInvestedInStock) / agregatedTransactionData.moneyInvestedInStock * 100;
            const gainPercentageRounded = Math.round(gainPercentage * 100) / 100

            gainAndSplitAdjustedStocks.push({
                ...stock,
                amountAfterSplit: agregatedTransactionData.amountAfterSplit,
                price: currentPrice,
                trend: stockHistory[0].trend,
                gainAbsolute: gainAbsolute,
                gainPercentage: gainPercentageRounded,
                histories: stockHistory
            })

            currentPortfolioValue += agregatedTransactionData.amountAfterSplit * currentPrice;
            gainAbsolutePortfolio += gainAbsolute;
            moneyInvestedPortfolio += agregatedTransactionData.moneyInvestedInStock;
        }

        const gainPercentagePortfolio = (gainAbsolutePortfolio - moneyInvestedPortfolio) / moneyInvestedPortfolio * 100
        const gainPercentagePortfolioRounded = Math.round(gainPercentagePortfolio * 100) / 100
        const portfolio: Portfolio = {
            currentPortfolioValue: currentPortfolioValue,
            gainAbsolute: gainAbsolutePortfolio,
            gainPercentage: gainPercentagePortfolioRounded,
            stocks: gainAndSplitAdjustedStocks
        }

        return portfolio;
    }
}