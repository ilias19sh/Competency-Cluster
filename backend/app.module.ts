import { Module } from '@nestjs/common';
import { UsersModule } from './src/features/users/users.module';
import { AppController } from 'app.controller';
import { PrismaService } from 'src/api';

@Module({
  imports: [/* UsersModule */],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {}