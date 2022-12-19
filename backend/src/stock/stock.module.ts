import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { StockAPITasks } from 'src/stockAPITasks/stockAPITasks.module';
import { StockAPITasksService } from 'src/stockAPITasks/stockAPITasks.service';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [StockAPITasks],
  controllers: [StockController],
  providers: [StockService, StockAPITasksService, UserService, AuthService, JwtService],
  exports: [StockService],
})
export class StockModule {}
