import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: ['error', 'warn'],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ Connecté à la base de données');
    } catch (error) {
      console.error('❌ Erreur de connexion Prisma au démarrage:', error);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}