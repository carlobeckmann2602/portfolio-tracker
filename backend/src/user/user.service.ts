import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { AuthService } from 'src/auth/auth.service';
@Injectable()
export class UserService {
  //enables prisma client db operations like save in the db
  constructor(private prisma: PrismaService, private authService: AuthService) {}

  async create(createUserDto: CreateUserDto) {
    //Guard function chech use passwords
    //maybe adding some more guards like no less then 6 letters...
    if (createUserDto.password !== createUserDto.password2) {
      throw new ForbiddenException('Passwords are not the same');
    }

    //generate password haswith argon
    const hash = await argon.hash(createUserDto.password);

    //check if user is already in db (email should be unique)
    try {
      //save user in db
      const user = await this.prisma.user.create({
        data: {
          email: createUserDto.email,
          hash,
          portfoliovalue: 0.0,
        },
      });

      //create JWT Token for user and return
      return this.authService.signToken(user.id, user.email);
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

  async findOne(uid: number) {
    //search in db with unique id
    const user = await this.prisma.user.findUnique({
      where: {
        id: uid,
      },
      include: {
        stocks: true,
      },
    });

    if (user === null) {
      throw new NotFoundException('User not found');
    }
    delete user.hash; //deletes hash field, because frontend dont need the pw
    return user;
  }

  async update(uid: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password !== updateUserDto.password2) {
      throw new ForbiddenException('Passwords are not the same');
    }
    try {
      const hash = await argon.hash(updateUserDto.password);
      const user = await this.prisma.user.update({
        where: {
          id: uid,
        },
        data: {
          email: updateUserDto.email,
          hash: hash,
        },
      });
      delete user.hash;
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('No User found');
        }
      }
      throw error;
    }
  }

  async remove(uid: number) {
    try {
      //disconnects the stocks in the mapper table
      await this.prisma.user.update({
        where: {
          id: uid,
        },
        data: {
          stocks: {
            deleteMany: {}, //deletes the entries in the mapper table stocksOnUser
          },
        },
        include: {
          stocks: true,
        },
      });
      //deletes user
      await this.prisma.user.delete({
        where: {
          id: uid,
        },
      });
      return `This action removed a user with ID:${uid}`;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('No User found');
        }
      }
      throw error;
    }
  }
}
