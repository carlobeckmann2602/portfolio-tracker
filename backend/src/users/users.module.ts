import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { StocksService } from 'src/stocks/stocks.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, StocksService],
})
export class UsersModule {}
