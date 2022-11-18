import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

//this module allows us a connection between the prisma folder outside of the src folder and our logic
@Global() //allows access to all modules
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
