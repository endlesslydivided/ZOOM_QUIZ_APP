import { Module } from '@nestjs/common';
import { PlaySessionsService } from './play-sessions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaySession } from './playSession.entity';
import { Result } from 'src/results/result.entity';
import { Quiz } from 'src/quizzes/quiz.entity';
import { PlaySessionsController } from './play-sessions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PlaySession,Result,Quiz])],
  providers: [PlaySessionsService],
  controllers: [PlaySessionsController],
  exports:[PlaySessionsService]

})
export class PlaySessionsModule {}
