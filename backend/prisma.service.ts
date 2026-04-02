import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error('DATABASE_URL is not defined');
    }

    super({
      adapter: new PrismaPg({ connectionString }),
      log: ['error', 'warn'],
    });
  }

  async onModuleInit() {
    this.logger.log('🚀 Initialisation du client Prisma...');
    
    try {
      await this.$connect();
      this.logger.log('✅ Connecté à la base de données via Cloud SQL Socket');
    } catch (err) {
      const error = err as Error;
      this.logger.error('❌ Erreur de connexion database :');
      this.logger.error(error.message);
      throw err;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
