import { Body, Controller, Get, Param, ParseIntPipe, Post} from '@nestjs/common';
import { StudentModulesService } from './student-modules.service';


// cree la route
@Controller('student-modules')
export class StudentModulesController {
  constructor(private readonly studentModulesService: StudentModulesService) {}

  @Get('student/:studentId')
  getStudentModules(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.studentModulesService.getStudentModules(studentId);
  }

  @Get('student/:studentId/profile')
  getStudentProfile(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.studentModulesService.getStudentProfile(studentId);
  }

  @Get('student/:studentId/submodule/:submoduleId/quiz')
  getSubmoduleQuiz(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('submoduleId', ParseIntPipe) submoduleId: number,
  ) {
    return this.studentModulesService.getSubmoduleQuiz(studentId, submoduleId);
  }

  @Post('student/:studentId/submodule/:submoduleId/submit')
  submitSubmoduleQuiz(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('submoduleId', ParseIntPipe) submoduleId: number,
    @Body()
    body: {
      answers: Array<{
        questionId: number;
        answerId?: number;
        answerIds?: number[];
      }>;
    },
  ) {
    return this.studentModulesService.submitSubmoduleQuiz(studentId, submoduleId, body.answers ?? []);
  }
}
