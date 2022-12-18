import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { StockAPITasks } from 'src/stockAPITasks/stockAPITasks.module';
import { StockAPITasksService } from 'src/stockAPITasks/stockAPITasks.service';

@Module({
  controllers: [StockController],
  providers: [StockService, StockAPITasksService],
  imports: [StockAPITasks],
})
export class StockModule {}
