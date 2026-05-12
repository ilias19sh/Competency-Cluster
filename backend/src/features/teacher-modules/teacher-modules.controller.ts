import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { TeacherModulesService } from './teacher-modules.service';

@Controller('teacher-modules')
export class TeacherModulesController {
  constructor(private readonly teacherModulesService: TeacherModulesService) {}

  @Post()
  createModule(
    @Body()
    body: {
      teacherId: number;
      title: string;
      subTitle: string;
      description: string;
      tags?: string[];
    },
  ) {
    return this.teacherModulesService.createModule(
      body.teacherId,
      body.title,
      body.subTitle,
      body.description,
      body.tags ?? [],
    );
  }

  @Get('teacher/:teacherId')
  getTeacherModules(@Param('teacherId', ParseIntPipe) teacherId: number) {
    return this.teacherModulesService.getTeacherModules(teacherId);
  }
}
