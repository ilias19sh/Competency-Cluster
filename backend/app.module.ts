import { Module } from '@nestjs/common';
import { UsersModule } from './src/features/users/users.module';
import { AuthModule } from './src/features/auth/auth.module';
import { TeacherModulesModule } from './src/features/teacher-modules/teacher-modules.module';
import { TeacherSubmodulesModule } from './src/features/teacher-submodules/teacher-submodules.module';
import { StudentModulesModule } from './src/features/student-modules/student-modules.module';

@Module({
  imports: [UsersModule, AuthModule, TeacherModulesModule, TeacherSubmodulesModule, StudentModulesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
