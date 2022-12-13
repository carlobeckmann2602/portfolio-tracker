import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { StockOnUserDto } from 'src/user/dto/stock-on-user.dto.';
@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}
  async addStockToUser(id: number, sid: number, stockTOnUserDto: StockOnUserDto) {
    try {
      //set relation between stock and user and updates stock in db
      await this.prisma.stocksOnUsers.upsert({
        where: {
          userId_stockId: {
            userId: id,
            stockId: sid,
          },
        },
        update: {
          amount: {
            increment: +stockTOnUserDto.amount, // amtomic number operation: Adds given amount to current amount
          },
        },
        create: {
          userId: id,
          stockId: sid,
          amount: +stockTOnUserDto.amount,
        },
      });
      return `This action updates a user with id #${id} with the transmitted stock data`;
    } catch (error) {
      //caching prismas notFound error P2025/P2003
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025' || error.code === 'P2003') {
          throw new NotFoundException('Stock not found');
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
      //decrements the amount of stock in a user modelif user sells some of his stocks
      const stocksOnUser = await this.prisma.stocksOnUsers.update({
        where: {
          userId_stockId: {
            userId: id,
            stockId: sid,
          },
        },
        data: {
          amount: {
            decrement: +stockTOnUserDto.amount,
          },
        },
      });
      //if the amount of stocks the user owns is smaller or equal zero the stock will be removed from the portfolio
      if (stocksOnUser.amount <= 0) {
        await this.prisma.stocksOnUsers.delete({
          where: {
            userId_stockId: {
              userId: id,
              stockId: sid,
            },
          },
        });
      }
      return `This action updates a user with id #${id} with the transmitted stock data`;
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
    });
    return stock;
  }
}
