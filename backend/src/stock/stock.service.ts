import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { StockOnUserDto } from 'src/user/dto/stock-on-user.dto.';
@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}
  async addStockToUser(id: number, sid: number, stockTOnUserDto: StockOnUserDto) {
    try {
      const stock = await this.findOne(sid);

      await this.prisma.transactions.create({
        data: {
          userId: id,
          stockId: sid,
          amount: +stockTOnUserDto.amount,
          price: stock.histories[0].high,
          time: stock.histories[0].time,
          buy: true,
        },
      });
      return `User with id #${id} bought stock with sid ${sid}. Price:${stock.histories[0].high}, Amount: ${stockTOnUserDto.amount}`;
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

  async findOne(id: number) {
    try {
      const stock = await this.prisma.stock.findUnique({
        where: {
          id: id,
        },
        include: {
          histories: {
            where: {
              stockId: id,
            },
            orderBy: {
              time: 'desc',
            },
            take: 1,
          },
        },
      });

      return stock;
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        throw new BadRequestException('Invalid parameter');
      }
      throw error;
    }
  }

  async removeStockFromUser(id: number, sid: number, stockTOnUserDto: StockOnUserDto) {
    try {
      const stock = await this.findOne(sid);
      const amountOfStock = await this.countStockAmount(id, sid);
      //check if user has enough stocks for selling
      if (amountOfStock - stockTOnUserDto.amount >= 0) {
        await this.prisma.transactions.create({
          data: {
            userId: id,
            stockId: sid,
            amount: +stockTOnUserDto.amount,
            price: stock.histories[0].high,
            time: stock.histories[0].time,
            buy: false,
          },
        });

        return `User with id #${id} sold stock with sid ${sid}. Price:${stock.histories[0].high}, Amount: ${stockTOnUserDto.amount}`;
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

  async countStockAmount(userID, stockID) {
    let stockAmount = 0;
    const userTransactions = await this.prisma.transactions.findMany({
      where: {
        userId: userID,
        stockId: stockID,
      },
    });

    for (let index = 0; index < userTransactions.length; index++) {
      if (userTransactions[index].buy) stockAmount += userTransactions[index].amount;
      else stockAmount -= userTransactions[index].amount;
    }
    return stockAmount;
  }
}
