import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../api';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        school: true,
      },
    });
  }
}