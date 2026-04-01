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
      log: ['error', 'warn'],
    });
  }

  async onModuleInit() {
    this.logger.log('🚀 Initialisation du client Prisma...');
    
    this.$connect()
      .then(() => {
        this.logger.log('✅ Connecté à la base de données via Cloud SQL Socket');
      })
      .catch((err) => {
        this.logger.error('❌ Erreur de connexion database (non-bloquante) :');
        this.logger.error(err.message);
      });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}