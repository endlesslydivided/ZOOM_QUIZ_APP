import { Module } from '@nestjs/common';

import { AnswersModule } from '../answers/answers.module';
import { PlaySessionsModule } from '../play-sessions/play-sessions.module';
import { ResultsModule } from '../results/results.module';
import { QuizzesController } from './quizzes.controller';
import { QuizGateway } from './quizzes.gateway';
import { QuizzesService } from './quizzes.service';

@Module({
  imports: [PlaySessionsModule, AnswersModule, ResultsModule],
  providers: [QuizzesService, QuizGateway],
  controllers: [QuizzesController],
})
export class QuizzesModule {}
