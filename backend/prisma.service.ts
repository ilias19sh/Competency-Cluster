import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super();
  }

  async onModuleInit() {
    this.$connect()
      .then(() => {
        console.log('✅ PRISMA V7 CONNECTÉ');
      })
      .catch((err) => {
        console.error('❌ PRISMA V7 CONNEXION LATE ERROR:', err.message);
      });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}