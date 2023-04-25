import { Module } from '@nestjs/common';
import { AnswersModule } from 'src/answers/answers.module';
import { PlaySessionsModule } from 'src/play-sessions/play-sessions.module';
import { ResultsModule } from 'src/results/results.module';
import { QuizzesController } from './quizzes.controller';
import { QuizGateway } from './quizzes.gateway';
import { QuizzesService } from './quizzes.service';

@Module({
  imports: [
    PlaySessionsModule,
    AnswersModule,
    ResultsModule,
  ],
  providers: [QuizzesService, QuizGateway],
  controllers: [QuizzesController],
})
export class QuizzesModule {}
