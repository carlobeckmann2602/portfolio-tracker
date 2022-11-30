import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { StockService } from 'src/stock/stock.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [UserController],
  providers: [UserService, StockService, PrismaService, AuthService],
})
export class UserModule {}
