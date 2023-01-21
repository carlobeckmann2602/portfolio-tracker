import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientValidationError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  async getStockWithHistory(sid: string, lastNumberOfDays = 1) {
    const fallBackWindow = new Date();
    fallBackWindow.setDate(fallBackWindow.getDate() - (lastNumberOfDays + 10));

    try {
      const stock = await this.prisma.stock.findUnique({
        where: {
          id: Number(sid),
        },
        include: {
          histories: {
            where: {
              stockId: Number(sid),
              time: { gte: fallBackWindow },
            },
            orderBy: {
              time: 'desc',
            },
            take: lastNumberOfDays,
          },
        },
      });

      if (stock === null) {
        throw new NotFoundException('Stock not found');
      }

      return stock;
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        throw new BadRequestException('Invalid parameter');
      }
      throw error;
    }
  }

  async getStockskWithHistory(sids: number[], lastNumberOfDays = 1) {
    if (sids.length === 0) {
      return [];
    }

    const fallBackWindow = new Date();
    fallBackWindow.setDate(fallBackWindow.getDate() - (lastNumberOfDays + 10));
    try {
      const stocks = await this.prisma.stock.findMany({
        where: {
          id: { in: sids },
        },
        include: {
          histories: {
            where: {
              time: { gte: fallBackWindow },
            },
            orderBy: {
              time: 'desc',
            },
            take: lastNumberOfDays,
            distinct: ['time'],
          },
        },
      });

      if (stocks.length === 0) {
        throw new NotFoundException('Stock not found');
      }

      return stocks;
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        throw new BadRequestException('Invalid parameter');
      }
      throw error;
    }
  }

  async searchStocks(stockName: string) {
    //searchs stock with name or symbol
    const searchWindow = new Date();
    searchWindow.setDate(searchWindow.getDate() - 7);
    try {
      const stocks = await this.prisma.stock.findMany({
        where: {
          OR: [
            {
              name: {
                contains: stockName,
                mode: 'insensitive',
              },
            },
            {
              symbol: {
                contains: stockName,
                mode: 'insensitive',
              },
            },
          ],
        },
        include: {
          histories: {
            where: {
              time: { gte: searchWindow },
            },
            take: 1,
            orderBy: { time: 'desc' },
          },
        },
      });

      return stocks;
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        throw new BadRequestException('Invalid parameter');
      }
      throw error;
    }
  }
  async countStockAmount(uid: number, sid: number): Promise<number> {
    let stockAmount = 0;
    const userTransactions = await this.prisma.transactions.findMany({
      where: {
        userId: uid,
        stockId: sid,
      },
    });

    for (let index = 0; index < userTransactions.length; index++) {
      if (userTransactions[index].buy) stockAmount += userTransactions[index].amount;
      else stockAmount -= userTransactions[index].amount;
    }
    return stockAmount;
  }
}
