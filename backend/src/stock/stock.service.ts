import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { StockOnUserDto } from 'src/user/dto/stock-on-user.dto.';
import { UserService } from 'src/user/user.service';
@Injectable()
export class StockService {
  constructor(private prisma: PrismaService, private userService: UserService) {}

  async addStockToUser(uid: number, sid: number, stockTOnUserDto: StockOnUserDto) {
    try {
      //adding stock to transactions
      const stock = await this.findOne(sid);

      await this.prisma.transactions.create({
        data: {
          userId: uid,
          stockId: sid,
          amount: stockTOnUserDto.amount,
          price: stock.histories[0].high,
          time: stock.histories[0].time,
          buy: true,
        },
      });

      //update the users portfolio value
      const user = await this.userService.findOne(uid);
      const new_portfoliovalue = user.portfoliovalue + stockTOnUserDto.amount * stock.histories[0].high;
      await this.prisma.user.update({
        where: {
          id: uid,
        },
        data: {
          portfoliovalue: new_portfoliovalue,
        },
      });
      return `User with id #${uid} bought stock with sid ${sid}. Price:${stock.histories[0].high}, Amount: ${stockTOnUserDto.amount}`;
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
  }

  async findOne(sid: number) {
    try {
      const stock = await this.prisma.stock.findUnique({
        where: {
          id: sid,
        },
        include: {
          histories: {
            where: {
              stockId: sid,
            },
            orderBy: {
              time: 'desc',
            },
            take: 1,
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

  async removeStockFromUser(uid: number, sid: number, stockTOnUserDto: StockOnUserDto) {
    try {
      const stock = await this.findOne(sid);
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
  }

  async searchStocks(stockName: string) {
    //searchs stock with name or symbol
    const stock = await this.prisma.stock.findMany({
      where: {
        OR: [
          {
            name: {
              contains: stockName,
              mode: 'insensitive',
            },
          },
          {
            AND: {
              symbol: {
                contains: stockName,
                mode: 'insensitive',
              },
            },
          },
        ],
      },
      include: {
        histories: {
          orderBy: {
            time: 'desc',
          },
          take: 1,
        },
      },
    });
    return stock;
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

  async findAllStocksOnUser(uid: number) {
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

    return stocksOnUser;
  }
}
