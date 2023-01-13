import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientValidationError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  async getStockWithHistory(sid: string, lastNumberOfDays = 1) {
    try {
      const stock = await this.prisma.stock.findUnique({
        where: {
          id: Number(sid),
        },
        include: {
          histories: {
            where: {
              stockId: Number(sid),
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
    const fallBackWindow = new Date();
    fallBackWindow.setDate(fallBackWindow.getDate() - lastNumberOfDays + 10);
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

  /* async removeStockFromUser(uid: number, sid: number, stockTOnUserDto: StockOnUserDto, pricePerAmount: number, date: Date) {
    try {
      const stock = await this.getStockWithHistory(sid);
      const amountOfStock = await this.countStockAmount(uid, sid);
      //check if user has enough stocks for selling
      if (amountOfStock - stockTOnUserDto.amount >= 0) {
        await this.prisma.transactions.create({
          data: {
            userId: uid,
            stockId: sid,
            amount: +stockTOnUserDto.amount,
            price: stock.histories[0].high,
            time: stock.histories[0].time,
            buy: false,
          },
        });

        //update the users portfolio value
        const user = await this.userService.findOne(uid);
        const new_portfoliovalue = user.portfoliovalue - stockTOnUserDto.amount * stock.histories[0].high;
        await this.prisma.user.update({
          where: {
            id: uid,
          },
          data: {
            portfoliovalue: new_portfoliovalue,
          },
        });

        return `User with id #${uid} sold stock with sid ${sid}. Price:${stock.histories[0].high}, Amount: ${stockTOnUserDto.amount}`;
      }

      throw new BadRequestException(
        `User can not sell more then his available amount of stocks. Available amount of stock ${stock.name}: ${amountOfStock}`,
      );
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        throw new BadRequestException('Invalid parameter');
      }
      throw error;
    }
  } */

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

  /* async findAllStocksOnUser(uid: number) {
    const user = await this.userService.findOne(uid);
    const transactions = user.stocks;
    const stocksOnUser = [];

    //Sort transactions with sid
    const sortedTransactions = transactions.sort((n1, n2) => {
      if (n1.stockId > n2.stockId) {
        return 1;
      }

      if (n1.stockId < n2.stockId) {
        return -1;
      }

      return 0;
    });

    const transactionsGroupsByStocks = [];
    let stockGroups = [];
    stockGroups.push(sortedTransactions[0]);
    if (sortedTransactions.length === 1) {
      transactionsGroupsByStocks.push(stockGroups);
    }
    for (let index = 1; index < sortedTransactions.length; index++) {
      if (sortedTransactions[index].stockId == sortedTransactions[index - 1].stockId) {
        stockGroups.push(sortedTransactions[index]);
      } else {
        transactionsGroupsByStocks.push(stockGroups);
        stockGroups = [];
        stockGroups.push(sortedTransactions[index]);
      }
      if (index == sortedTransactions.length - 1) {
        transactionsGroupsByStocks.push(stockGroups);
      }
    }

    for (let i = 0; i < transactionsGroupsByStocks.length; i++) {
      const stockCombined = {
        id: transactionsGroupsByStocks[i][0].stockId,
        symbol: (await this.findOne(transactionsGroupsByStocks[i][0].stockId)).symbol,
        name: (await this.findOne(transactionsGroupsByStocks[i][0].stockId)).name,
        description: (await this.findOne(transactionsGroupsByStocks[i][0].stockId)).description,
        totalValue: 0,
        totalAmount: 0,
      };
      for (let j = 0; j < transactionsGroupsByStocks[i].length; j++) {
        if (transactionsGroupsByStocks[i][j].buy) {
          stockCombined.totalAmount += transactionsGroupsByStocks[i][j].amount;
          stockCombined.totalValue += transactionsGroupsByStocks[i][j].price * transactionsGroupsByStocks[i][j].amount;
        } else {
          stockCombined.totalAmount -= transactionsGroupsByStocks[i][j].amount;
          stockCombined.totalValue -= transactionsGroupsByStocks[i][j].price * transactionsGroupsByStocks[i][j].amount;
        }
      }
      stocksOnUser.push(stockCombined);
    }
    const portfolio = {
      portfoliovalue: user.portfoliovalue,
      stocksOnUser,
    };

    return portfolio;
  } */
}
