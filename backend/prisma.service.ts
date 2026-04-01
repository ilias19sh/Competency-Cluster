import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { emit: 'stdout', level: 'error' },
        { emit: 'stdout', level: 'warn' },
      ],
    });
  }

  async onModuleInit() {
    this.$connect()
      .then(() => {
        this.logger.log('✅ DATABASE CONNECTED SUCCESSFULLY');
      })
      .catch((err) => {
        this.logger.error('❌ DATABASE CONNECTION ERROR');
        this.logger.error(err);
      });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}