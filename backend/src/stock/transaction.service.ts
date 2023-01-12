import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { StockGainAndSplitAdjusted } from './interfaces/StockGainAndSplitAdjusted';
import { PortfolioService } from './portfolio.service';
import { SplitService } from './split.service';
import { StockService } from './stock.service';

@Injectable()
export class TransactionService {
  constructor(
    private prisma: PrismaService,
    private portfolioService: PortfolioService,
    private stockService: StockService,
    private splitService: SplitService,
  ) {}
  async addTransaction(
    uid: number,
    sid: number,
    amount: number,
    buy: boolean,
    pricePerUnit: number,
    date: Date,
  ): Promise<StockGainAndSplitAdjusted> {
    // we might want to implement a check to make sure that the amount the user sells is smaller than the amount he currently owns
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

    const transactions = await this.splitService.createSplitAdjustedTransactions(uid, sid);
    const transactionAgregationData = this.portfolioService.agregateTransactions(transactions);
    return this.portfolioService.createGainAndSplitAdjustedStock(sid, transactionAgregationData);
  }
}
