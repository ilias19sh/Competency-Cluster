import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super();
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ CONNEXION BDD RÉUSSIE (V7)');
    } catch (err) {
      console.error('❌ ERREUR PRISMA V7 AU DÉMARRAGE :');
      console.error(err.message);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}