import { Controller, Get, Param, ParseIntPipe} from '@nestjs/common';
import { StudentModulesService } from './student-modules.service';


// cree la route
@Controller('student-modules')
export class StudentModulesController {
  constructor(private readonly studentModulesService: StudentModulesService) {}

  @Get('student/:studentId')
  getStudentModules(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.studentModulesService.getStudentModules(studentId);
  }
}

