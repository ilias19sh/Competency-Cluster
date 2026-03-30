import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super();
  }

async onModuleInit() {
  this.$connect()
    .then(() => console.log('Connexion BDD OK ✅'))
    .catch((err) => console.error('Erreur BDD : ', err));
}
}