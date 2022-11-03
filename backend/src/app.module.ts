import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { StocksModule } from './stocks/stocks.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [UsersModule, StocksModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
