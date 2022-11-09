import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { Stock } from '@prisma/client';
@Injectable()
export class UserService {
  //enables prisma client db operations like save in the db
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    //generate password haswith argon
    const hash = await argon.hash(createUserDto.password);

    //check if user is already in db (email should be unique)
    try {
      //save user in db
      const user = await this.prisma.user.create({
        data: {
          email: createUserDto.email,
          hash,
        },
        select: {
          //"Select" allows us to send wanted data back to the client.
          id: true,
          email: true,
        },
      });
      //return saved user (only selected fields)
      return user;
    } catch (error) {
      //caching prismas unique duplicate error P2002
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async findOne(id: number) {
    //search in db with unique id
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (user === null) {
      throw new NotFoundException();
    }
    delete user.hash; //deletes hash field, because frontend dont need the pw
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user with the transmitted data ${updateUserDto}`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findStocksOnUser(id: number) {
    const stocksOnUser = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        stocks: {
          select: {
            stock: true,
            amount: true,
          },
        },
      },
    });
    return stocksOnUser;
  }
}
