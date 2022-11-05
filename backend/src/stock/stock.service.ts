import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}
  async addStockToUser(id: number, sid: number) {
    try {
      //set relation between stock and user and updates stock in db
      const stock = await this.prisma.stock.update({
        where: {
          id: sid,
        },
        data: {
          userId: id,
        },
      });

      //return??? redirect auf portfolio Seite?
      return `This action adds a stock with ID:${sid} to user with ID: ${id}`;
    } catch (error) {
      //caching prismas notFound error P2025
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

  findOne(id: number) {
    return `This action returns a #${id} stock`;
  }

  removeStockFromUser(id: number, sid: number) {
    return `This action removes a stock with ID:${sid} from user with ID: ${id}`;
  }
}
