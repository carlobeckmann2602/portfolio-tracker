import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { argv } from 'node:process';

//PrismaService extends parentclass PrismaClient, which was installed with npm before
@Injectable()
export class PrismaService extends PrismaClient<Prisma.PrismaClientOptions, 'query'> {
  constructor() {
    const config = {
      datasources: {
        db: {
          url: 'postgresql://postgres:123@db:5432/postgres?schema=public', //later we need variable in a config file
          //url: config.get('DATABASE_URL'), //for local development
        },
      },
      log: [],
    };
    if (argv.includes('printsql')) {
      config.log = [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'error' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
      ];
    }

    super(config);

    this.$on('query', (e) => {
      console.log('Query: ' + e.query);
      console.log('Params: ' + e.params);
      console.log('Duration: ' + e.duration + 'ms');
    });
  }
}
