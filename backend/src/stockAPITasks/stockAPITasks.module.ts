import { Module } from '@nestjs/common';
import { StockAPITasksService } from './stockAPITasks.service';

@Module({
  providers: [StockAPITasks],
})
export class StockAPITasks {}