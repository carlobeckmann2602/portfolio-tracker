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
export class PortFolioService {
    constructor(private splitService: Splitservice, private prisma: PrismaService, private stockService: StockService) { }

    async getPortfolioData(uid: number) {

        const transactions = await this.splitService.createSplitAdjustedTransactions(uid)

        // i do not understand why the type definition of GroupedTransactions is necessary
        const groupedTransactions: TransactionsGrouped =
            transactions.reduce((container: TransactionsGrouped, currentTransaction: TransactionGainAndSplitAdjusted) => {
                container[currentTransaction.stockId] = container[currentTransaction.stockId] || []
                container[currentTransaction.stockId].push(currentTransaction);
                return container;
            }, {})

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

        const gainAndSplitAdjustedStocks: StockGainAndSplitAdjusted[] = []

        let portfolioValue = 0;
        let gainAbsolutePortfolio = 0;
        let moneyInvestedPortfolio = 0;

        for (const stockId in agregatedTransactionsContainer) {
            const agregatedTransactionData = agregatedTransactionsContainer[stockId]

            const stock = await this.prisma.stock.findFirst({ where: { id: Number(stockId) } })

            const currentPrice = (await this.stockService.getStockWithHistory(Number(stockId))).histories[0].open;
            const yesterdaysPrice = (await this.stockService.getStockWithHistory(Number(stockId), 2)).histories[1].open
            const trend = yesterdaysPrice
                ? Math.round((currentPrice - yesterdaysPrice) / yesterdaysPrice * 100 * 100) / 100 : 0

            const gainAbsolute = agregatedTransactionData.moneyRecievedFromSales - agregatedTransactionData.moneyInvestedInStock
                + (agregatedTransactionData.amountAfterSplit * currentPrice);
            const gainPercentage = gainAbsolute / agregatedTransactionData.moneyInvestedInStock;
            const gainPercentageRounded = Math.round(gainPercentage * 100) / 100

            gainAndSplitAdjustedStocks.push({
                ...stock,
                amountAfterSplit: agregatedTransactionData.amountAfterSplit,
                price: currentPrice,
                trend: trend,
                gainAbsolute: gainAbsolute,
                gainPercentage: gainPercentageRounded
            })

            portfolioValue += agregatedTransactionData.amountAfterSplit * currentPrice;
            gainAbsolutePortfolio += gainAbsolute;
            moneyInvestedPortfolio += agregatedTransactionData.moneyInvestedInStock;
        }

        const portfolio: Portfolio = {
            currentValue: portfolioValue,
            gainAbsolute: gainAbsolutePortfolio,
            gainPercentage: gainAbsolutePortfolio / moneyInvestedPortfolio,
            stocks: gainAndSplitAdjustedStocks
        }

        return portfolio;
    }
}