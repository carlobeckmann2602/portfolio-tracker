import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { TasksModule } from 'src/tasks/tasks.module';
import { TasksService } from 'src/tasks/tasks.service';

@Module({
  controllers: [StockController],
  providers: [StockService, TasksService],
  imports: [TasksModule],
})
export class StockModule {}
