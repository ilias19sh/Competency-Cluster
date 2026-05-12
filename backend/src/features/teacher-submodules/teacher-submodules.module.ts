import { Module } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { TeacherSubmodulesController } from './teacher-submodules.controller';
import { TeacherSubmodulesService } from './teacher-submodules.service';

@Module({
  controllers: [TeacherSubmodulesController],
  providers: [TeacherSubmodulesService, PrismaService],
})
export class TeacherSubmodulesModule {}
