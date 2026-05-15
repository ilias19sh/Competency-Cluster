import { Module } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { StudentModulesController } from './student-modules.controller';
import { StudentModulesService } from './student-modules.service';

@Module({
    controllers: [StudentModulesController],
    providers: [StudentModulesService, PrismaService],
})
export class StudentModulesModule {}