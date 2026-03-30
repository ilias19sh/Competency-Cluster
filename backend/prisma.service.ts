import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      datasourceUrl: process.env.DATABASE_URL,
    } as any);
  }

  async onModuleInit() {
    try {
      this.$connect()
        .then(() => console.log('✅ BDD Connectée'))
        .catch((e) => console.error('❌ Erreur de connexion différée:', e.message));
        
    } catch (error) {
      console.error('❌ Erreur fatale initialisation Prisma:', error.message);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}