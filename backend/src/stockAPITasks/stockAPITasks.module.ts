import { Module } from '@nestjs/common';
import { StockAPITasksService } from './stockAPITasks.service';

@Module({
  providers: [StockAPITasksService],
})
export class StockAPITasks {}
