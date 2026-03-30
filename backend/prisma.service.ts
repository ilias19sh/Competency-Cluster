import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ CONNEXION BDD RÉUSSIE');
    } catch (err) {
      console.error('❌ ÉCHEC CONNEXION BDD :', err.message);
      throw err;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}