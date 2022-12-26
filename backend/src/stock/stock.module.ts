import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { StockAPITasks } from 'src/stockAPITasks/stockAPITasks.module';
import { StockAPITasksService } from 'src/stockAPITasks/stockAPITasks.service';
import { UserService } from 'src/user/user.service';
import { PortFolioService } from './portfolio.service';
import { Splitservice } from './split.service';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
@Module({
  imports: [JwtModule.register({}), StockAPITasks],
  controllers: [StockController],
  providers: [StockService, Splitservice, PortFolioService, StockAPITasksService, UserService, AuthService, JwtService],
  exports: [StockService, Splitservice],
})
export class StockModule { }
