import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('users')
  async getUsers() {
    return this.prisma.user.findMany({
      orderBy: { id: 'asc' },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        phone: true,
        school_id: true,
      },
    });
  }
}
