import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { StockModule } from './stock/stock.module';
import { UserModule } from './user/user.module';

//ConfigModule is set on global to allow access to it from every other module
@Module({
  imports: [
    UserModule,
    StockModule,
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
