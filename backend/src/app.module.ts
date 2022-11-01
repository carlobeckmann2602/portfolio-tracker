import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StockModule } from './stock/stock.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, StockModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
