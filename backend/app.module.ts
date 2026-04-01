import { Module } from '@nestjs/common';
import { UsersModule } from './src/features/users/users.module';
import { AuthModule } from './src/features/auth/auth.module';

@Module({
  imports: [UsersModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
