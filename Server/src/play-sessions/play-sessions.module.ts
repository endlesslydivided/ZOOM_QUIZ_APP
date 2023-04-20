import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Quiz } from 'src/quizzes/quiz.entity';
import { Result } from 'src/results/result.entity';
import { PlaySessionsController } from './play-sessions.controller';
import { PlaySessionsService } from './play-sessions.service';
import { PlaySession } from './playSession.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([PlaySession,Result,Quiz]),AuthModule],
  providers: [PlaySessionsService],
  controllers: [PlaySessionsController],
  exports:[PlaySessionsService]

})
export class PlaySessionsModule {}
