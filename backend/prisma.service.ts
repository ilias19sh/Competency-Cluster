import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      datasource: {
        url: process.env.DATABASE_URL,
      },
    } as any);
  }

  async onModuleInit() {
    this.$connect()
      .then(() => console.log('✅ PRISMA V7 CONNECTÉ'))
      .catch((err) => console.error('❌ PRISMA V7 ERROR:', err.message));
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}