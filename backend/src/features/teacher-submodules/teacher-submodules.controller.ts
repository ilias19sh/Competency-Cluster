import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { TeacherSubmodulesService } from './teacher-submodules.service';
// 1. On importe DIRECTEMENT ta fonction depuis le dossier api
import { generateQuiz } from '../../api/generateQuiz';

@Controller('teacher-submodules')
export class TeacherSubmodulesController {
  constructor(private readonly teacherSubmodulesService: TeacherSubmodulesService) {}

  @Post()
  createSubmodule(
    @Body()
    body: {
      teacherId: number;
      moduleId: number;
      title: string;
      description: string;
      program?: string | null;
      studyLevel?: string | null;
      questions: Array<{
        value: string;
        answers: Array<{
          value: string;
          isGoodAnswer: boolean;
        }>;
      }>;
    },
  ) {
    return this.teacherSubmodulesService.createSubmodule(
      body.teacherId,
      body.moduleId,
      body.title,
      body.description,
      body.questions,
      body.program,
      body.studyLevel,
    );
  }

  // 🛠️ LA ROUTE CORRIGÉE : On court-circuite le service récalcitrant !
  @Post('generate-ai')
  async generateAiQuiz(
    @Body()
    body: {
      theme: string;
      numQuestions?: number;
    },
  ) {
    // On appelle directement la fonction importée tout en haut
    const quiz = await generateQuiz(body.theme, body.numQuestions ?? 3);
    return quiz;
  }

  @Get('module/:moduleId')
  getModuleSubmodules(@Param('moduleId', ParseIntPipe) moduleId: number) {
    return this.teacherSubmodulesService.getModuleSubmodules(moduleId);
  }

  @Get(':submoduleId')
  getSubmoduleById(@Param('submoduleId', ParseIntPipe) submoduleId: number) {
    return this.teacherSubmodulesService.getSubmoduleById(submoduleId);
  }

  @Patch(':submoduleId/questions')
  updateSubmoduleQuestions(
    @Param('submoduleId', ParseIntPipe) submoduleId: number,
    @Body()
    body: {
      questions: Array<{
        value: string;
        answers: Array<{
          value: string;
          isGoodAnswer: boolean;
        }>;
      }>;
    },
  ) {
    return this.teacherSubmodulesService.updateSubmoduleQuestions(submoduleId, body.questions ?? []);
  }

  @Get('teacher/:teacherId')
  getTeacherSubmodules(@Param('teacherId', ParseIntPipe) teacherId: number) {
    return this.teacherSubmodulesService.getTeacherSubmodules(teacherId);
  }
}