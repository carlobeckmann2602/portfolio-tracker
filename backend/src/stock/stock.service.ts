import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { Stock } from '@prisma/client';
import { AddStockToUserDto } from 'src/user/dto/add-stock-to-user';
@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}
  async addStockToUser(id: number, sid: number, addStockToUserDto: AddStockToUserDto) {
    try {
      //set relation between stock and user and updates stock in db
      const stock = await this.prisma.stocksOnUsers.upsert({
        where: {
          userId_stockId: {
            userId: id,
            stockId: sid,
          },
        },
        update: {
          amount: {
            increment: +addStockToUserDto.amount, // amtomic number operation: Adds given amount to current amount
          },
        },
        create: {
          userId: id,
          stockId: sid,
          amount: +addStockToUserDto.amount,
        },
      });
      //return? All stocks from user for portfolio page?
      return `This action adds a stock with ID:${sid} to user with ID: ${id}`;
    } catch (error) {
      console.log(error.code);

      //caching prismas notFound error P2001
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Stock not found');
        }
      }
      throw error;
    }

    //hier muss noch Logic hin um zu ermitteln wie viele stocks der user von einer sorte besitzt
    //momentan bekommt er die stocks einfach zugewiesen
  }

  findAll() {
    return `This action returns all stocks`;
  }

  async findOne(id: number) {
    const stock = await this.prisma.stock.findUnique({
      where: {
        id: id,
      },
    });

    return stock;
    return `This action returns a #${id} stock`;
  }

  removeStockFromUser(id: number, sid: number) {
    try {
    } catch (error) {}
    return `This action removes a stock with ID:${sid} from user with ID: ${id}`;
  }
}
