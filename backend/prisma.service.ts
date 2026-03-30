import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const url = process.env.DATABASE_URL;
    
    super({
      datasourceUrl: url,
    } as any); 
  }

  async onModuleInit() {
    this.$connect()
      .then(() => console.log('✅ PRISMA V7 CONNECTÉ'))
      .catch((err) => console.error('❌ ERREUR CONNEXION V7:', err.message));
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}