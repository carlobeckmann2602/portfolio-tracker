import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { StockModule } from './stock/stock.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

//ConfigModule is set on global to allow access to it from every other module
@Module({
  imports: [UserModule, StockModule, AuthModule, PrismaModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
