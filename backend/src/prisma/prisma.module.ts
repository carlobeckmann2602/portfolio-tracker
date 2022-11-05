import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

//this module allows us a connection between the prisma folder outside of the src folder and our logic
@Module({
  providers: [PrismaService],
})
export class PrismaModule {}
