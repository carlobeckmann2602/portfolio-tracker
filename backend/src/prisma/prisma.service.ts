import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

//PrismaService extends parentclass PrismaClient, which was installed with npm before
@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: 'postgresql://postgres:123@db:5432/postgres?schema=public', //later we need variable in a config file
          //url: config.get('DATABASE_URL'), //for local development
        },
      },
    });
  }
}
