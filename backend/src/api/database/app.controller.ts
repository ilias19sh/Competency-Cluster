import { Controller, Get, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('users')
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Récupérer tous les utilisateurs (GET /users)
  @Get()
  async getAllUsers() {
    try {
      return await this.prisma.user.findMany({
        include: {
          school: true, // Affiche les infos de l'école liée
        },
      });
    } catch (error) {
      throw new HttpException(
        `Erreur BDD : ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 2. Créer un utilisateur de test (POST /users/seed)
  // Pratique pour tester sans front-end !
  @Post('seed')
  async seedUser() {
    try {
      // On vérifie d'abord s'il existe une école (indispensable pour ton schéma)
      let school = await this.prisma.school.findFirst();
      
      if (!school) {
        school = await this.prisma.school.create({
          data: {
            name: 'Ecole Test',
            city: 'Paris',
            zip_code: '75000',
            address: '1 rue du test',
            domain: 'test.com',
          },
        });
      }

      return await this.prisma.user.create({
        data: {
          email: `test-${Date.now()}@gmail.com`,
          first_name: 'Zoro',
          last_name: 'Roronoa',
          phone: '0601020304',
          password: 'hashed_password_here',
          school_id: school.id,
        },
      });
    } catch (error) {
      throw new HttpException(
        `Erreur création : ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}