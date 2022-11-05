import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

//PrismaService extends parentclass PrismaClient, which was installed with npm before
@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: 'postgresql://postgres:123@localhost:5434/postgres?schema=public', //later we need variable in a config file
        },
      },
    });
  }
}
