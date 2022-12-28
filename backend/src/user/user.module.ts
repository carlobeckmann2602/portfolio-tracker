import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PortfolioService } from 'src/stock/portfolio.service';
import { StockModule } from 'src/stock/stock.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [JwtModule.register({}), StockModule],
  controllers: [UserController],
  providers: [UserService, PrismaService, PortfolioService, AuthService],
  exports: [UserService],
})
export class UserModule { }
