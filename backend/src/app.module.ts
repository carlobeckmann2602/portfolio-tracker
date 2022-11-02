import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { StocksModule } from './stocks/stocks.module';
import { SessionsModule } from './sessions/sessions.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [UsersModule, StocksModule, SessionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
