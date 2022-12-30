import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { TransactionSplitAdjusted } from "./interfaces/transactions/TransactionSplitAdjusted";
import { StockService } from "./stock.service";

@Injectable()
export class SplitService {
    constructor(private prisma: PrismaService, private stockService: StockService) { }

    async createSplitAdjustedTransactions(userId: number, sid?: number): Promise<TransactionSplitAdjusted[]> {
        // get each transaction for uid + sid
        const query: Prisma.TransactionsFindManyArgs = {
            where: {
                userId: userId
            }
        }

        if (sid) {
            query.where.stockId = sid
        }

        const transactions = await this.prisma.transactions.findMany(query)

        // create list of all splits for sid 
        const splits = await this.prisma.stockHistory.findMany({
            where: {
                NOT: {
                    split: {
                        equals: 1.0
                    }
                }
            }
        })

        // adjusts amount and value according to split factor
        const splitAdjustedTransactions: TransactionSplitAdjusted[] = transactions.map(transaction => {

            const splitAdjustedTransaction: TransactionSplitAdjusted = {
                ...transaction,
                split: 1.0,
                amountAfterSplit: transaction.amount,
                priceAfterSplit: transaction.price
            }

            splits.forEach(split => {
                if (splitAdjustedTransaction.stockId === split.stockId && splitAdjustedTransaction.time < split.time) {
                    splitAdjustedTransaction.split *= split.split;
                    splitAdjustedTransaction.amountAfterSplit *= split.split;
                    splitAdjustedTransaction.priceAfterSplit /= split.split;
                }
            })

            return splitAdjustedTransaction;
        })

        return splitAdjustedTransactions
    }

    /* 
        async createGainAndSplitAdjustedTransactions
            (userId: number): Promise<TransactionGainAndSplitAdjusted[]> {
            const splitAdjustedTransactions = await this.createSplitAdjustedTransactions(userId)
            const gainAndSplitAdjustedTransactionsPromise =
                splitAdjustedTransactions.map(async splitAdjustedTransaction => {
                    const stock = await this.stockService.getStockWithHistory(splitAdjustedTransaction.stockId)
                    console.log(splitAdjustedTransactions, userId, stock)
    
                    const gainAbsolute = (stock.histories[0].close - splitAdjustedTransaction.priceAfterSplit) * splitAdjustedTransaction.amountAfterSplit
                    const gainPercentage = (stock.histories[0].close - splitAdjustedTransaction.priceAfterSplit) / splitAdjustedTransaction.priceAfterSplit * 100
                    const gainPercentageRounded = Math.round(gainPercentage * 100) / 100
                    const gainAndSplitadjustedTransaction: TransactionGainAndSplitAdjusted = {
                        ...splitAdjustedTransaction,
                        gainAbsolute: gainAbsolute,
                        gainPercentage: gainPercentageRounded
                    }
                    console.log(stock.histories[0].close, splitAdjustedTransaction)
                    return gainAndSplitadjustedTransaction;
                })
    
            const gainAndSplitAdjustedTransactions = Promise.all(gainAndSplitAdjustedTransactionsPromise)
    
            return gainAndSplitAdjustedTransactions;
        }
     */

}