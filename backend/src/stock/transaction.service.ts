import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime";
import { PrismaService } from "src/prisma/prisma.service";
import { StockGainAndSplitAdjusted } from "./interfaces/StockGainAndSplitAdjusted";
import { PortfolioService } from "./portfolio.service";
import { StockService } from "./stock.service";

@Injectable()
export class TransactionService {
    constructor(private prisma: PrismaService, private portfolioService: PortfolioService, private stockService: StockService) { }
    async addTransaction(uid: number, sid: number, amount: number, buy: boolean, pricePerUnit: number, date: Date): Promise<StockGainAndSplitAdjusted> {

        const transactionGroup = await this.portfolioService.getGroupedTransactions({ uid, sid });
        const transactionsAggregated = this.portfolioService.agregateTransactions(transactionGroup);
        const aggregatedStockData = transactionsAggregated[sid];
        if (!buy && amount > aggregatedStockData.amountAfterSplit) {
            throw new BadRequestException(
                `User can not sell more then his available amount of stocks. Available amount of stock ${aggregatedStockData.amountAfterSplit}`,
            );
        }
        // get stock data
        // throw exception in amount is bigger than amount in portfolio
        try {
            await this.prisma.transactions.create({
                data: {
                    userId: uid,
                    stockId: sid,
                    amount: amount,
                    price: pricePerUnit,
                    time: date || new Date(),
                    buy: buy,
                },
            });
        } catch (error) {
            //caching prismas notFound error P2025/P2003
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025' || error.code === 'P2003') {
                    throw new NotFoundException('Not found');
                }
            }
            if (error instanceof PrismaClientValidationError) {
                throw new BadRequestException('Invalid parameter');
            }
            throw error;
        }

        const stock = await this.prisma.stock.findFirst({ where: { id: sid } });
        const stockWithHistory = await this.stockService.getStockWithHistory(sid);
        const amountAfterSplit = buy ? aggregatedStockData.amountAfterSplit + amount : aggregatedStockData.amountAfterSplit - amount;
        const gainAbsolute = (aggregatedStockData.moneyRecievedFromSales - aggregatedStockData.moneyInvestedInStock) / aggregatedStockData.moneyInvestedInStock +
            stockWithHistory.histories[0].close * amountAfterSplit
        const gainAbsoluteRounded = Math.round(gainAbsolute * 100) / 100
        const gainPercentageRounded = Math.round(gainAbsolute - aggregatedStockData.moneyInvestedInStock / aggregatedStockData.moneyInvestedInStock * 100) / 100
        return {
            ...stock,
            amountAfterSplit: buy ? aggregatedStockData.amountAfterSplit + amount : aggregatedStockData.amountAfterSplit - amount,
            price: stockWithHistory.histories[0].close,
            trend: stockWithHistory.histories[0].trend,
            gainAbsolute: gainAbsoluteRounded,
            gainPercentage: gainPercentageRounded
        }
    }
}