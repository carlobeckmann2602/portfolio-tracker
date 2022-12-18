import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { StockAPITasks } from 'src/stockAPITasks/stockAPITasks.module';

@Module({
  controllers: [StockController],
  providers: [StockService, StockAPITasks],
  imports: [StockAPITasks],
})
export class StockModule {}
