import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { StockModule } from './stock/stock.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [UserModule, StockModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
