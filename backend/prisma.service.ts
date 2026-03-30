import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  // On ne met pas de constructeur personnalisé pour laisser Prisma
  // s'initialiser tranquillement avec les variables d'env par défaut.

  async onModuleInit() {
    console.log('Tentative de connexion à la BDD...');
    // On ne met pas de "await" pour ne pas bloquer NestJS si la BDD est lente
    this.$connect()
      .then(() => {
        console.log('✅ CONNEXION BDD RÉUSSIE');
      })
      .catch((err) => {
        // Ici, on log l'erreur mais on ne "throw" pas, pour que l'app reste en vie
        console.error('❌ ÉCHEC CONNEXION BDD (mais l’app tourne) :', err.message);
      });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}