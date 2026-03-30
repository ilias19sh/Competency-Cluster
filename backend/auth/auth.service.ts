import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

type UserRole = 'admin' | 'teacher' | 'student';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login(email: string, password: string) {
    if (!email || !password) {
      throw new UnauthorizedException('Email ou mot de passe invalide');
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        admin: true,
        teacher: true,
        student: true,
      },
    });

    if (!user || user.password !== password) {
      throw new UnauthorizedException('Email ou mot de passe invalide');
    }

    const role = this.getRole(user);

    if (!role) {
      throw new UnauthorizedException('Aucun role associe a cet utilisateur');
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role,
    };
  }

  private getRole(user: {
    admin: unknown;
    teacher: unknown;
    student: unknown;
  }): UserRole | null {
    if (user.admin) {
      return 'admin';
    }

    if (user.teacher) {
      return 'teacher';
    }

    if (user.student) {
      return 'student';
    }

    return null;
  }
}
