import {BadRequestException,ConflictException,Injectable,UnauthorizedException} from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import * as bcrypt from 'bcrypt';

type UserRole = 'admin' | 'teacher' | 'student';


const PASSWORD =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/;

const BCRYPT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(email: string, password: string, confirmPassword: string) {
    if (!email || !password || !confirmPassword) {
      throw new BadRequestException('Tous les champs sont obligatoires');
    }

    if (password !== confirmPassword) {
      throw new BadRequestException('Les mots de passe ne correspondent pas');
    }

    if (!PASSWORD.test(password)) {
      throw new BadRequestException(
        'The password must contain at least 12 characters, including one lowercase letter, one uppercase letter, one number, and one special character.',
      );
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Un compte existe deja avec cet email');
    }

    // Tant que le setup profile n'existe pas encore, on rattache le compte a une ecole par defaut.
    const defaultSchool = await this.prisma.school.findFirst({
      where: { id: 1 },
      select: { id: true },
    });

    if (!defaultSchool) {
      throw new BadRequestException("Aucune ecole par defaut n'est disponible");
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    //  on met des infos random les vraies infos seront mises plus tard 
    const user = await this.prisma.user.create({
      data: {
        email,
        password: passwordHash,
        first_name: 'John',
        last_name: 'Doe',
        phone: '0000000000',
        school_id: defaultSchool.id,
      },
    });

    
    return {
      id: user.id,
      email: user.email,
      message: 'Compte cree',
      profileCompleted: false,
    };
  }

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

    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe invalide');
    }

    const passwordMatches = user.password.startsWith('$2')
      ? await bcrypt.compare(password, user.password)
      : user.password === password;

    if (!passwordMatches) {
      throw new UnauthorizedException('Email ou mot de passe invalide');
    }

    if (!user.password.startsWith('$2')) {
      const upgradedHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
      await this.prisma.user.update({
        where: { id: user.id },
        data: { password: upgradedHash },
      });
    }

    // Le role n'est pas stocke directement dans User : on le deduit des relations Prisma.
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

  async completeProfile(
    userId: number,
    firstName: string,
    lastName: string,
    phone: string,
    isTeacher: boolean,
    program?: string | null,
    studyLevel?: string | null,
  ) {
    if (!userId || !firstName || !lastName || !phone) {
      throw new BadRequestException('Tous les champs du profil sont obligatoires');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { id: Number(userId) },
      select: { id: true, email: true },
    });

    if (!existingUser) {
      throw new BadRequestException("L'utilisateur a completer est introuvable");
    }

    // ici on met a jour les vrais info a la place des infos random
    const updatedUser = await this.prisma.user.update({
      where: { id: existingUser.id },
      data: {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim(),
      },
    });

    let role: UserRole;

    if (isTeacher) {
      role = 'teacher';

      const existingTeacher = await this.prisma.teacher.findUnique({
        where: { id: updatedUser.id },
        select: { id: true },
      });

      if (!existingTeacher) {
        await this.prisma.teacher.create({
          data: {
            id: updatedUser.id,
            status: 'active',
          },
        });
      }
    } else {
      if (!program || !studyLevel) {
        throw new BadRequestException('Le programme et le niveau d etude sont obligatoires pour un student');
      }

      const targetProgram = await this.prisma.program.findFirst({
        where: {
          title: program,
        },
        select: { id: true },
      });

      if (!targetProgram) {
        throw new BadRequestException('Le programme selectionne est introuvable');
      }

      const targetPromo = await this.prisma.promo.findFirst({
        where: {
          program_id: targetProgram.id,
          study_year: studyLevel,
        },
        select: { id: true },
      });

      if (!targetPromo) {
        throw new BadRequestException('Le study level selectionne est introuvable');
      }

      role = 'student';

      const existingStudent = await this.prisma.student.findUnique({
        where: { id: updatedUser.id },
        select: { id: true },
      });

      if (!existingStudent) {
        await this.prisma.student.create({
          data: {
            id: updatedUser.id,
            status: 'active',
            promo_id: targetPromo.id,
          },
        });
      }
    }

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.first_name,
      lastName: updatedUser.last_name,
      phone: updatedUser.phone,
      role,
      profileCompleted: true,
      message: 'Profil complete avec succes',
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
