import { Module } from '@nestjs/common';
import { UsersModule } from './src/features/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}