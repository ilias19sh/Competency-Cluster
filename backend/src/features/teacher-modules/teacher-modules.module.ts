import { Module } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { TeacherModulesController } from './teacher-modules.controller';
import { TeacherModulesService } from './teacher-modules.service';

@Module({
  controllers: [TeacherModulesController],
  providers: [TeacherModulesService, PrismaService],
})
export class TeacherModulesModule {}
