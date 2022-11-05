import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { StockService } from 'src/stock/stock.service';

@Module({
  controllers: [UserController],
  providers: [UserService, StockService],
})
export class UserModule {}
