import { Module } from '@nestjs/common';

import { AnswersModule } from '../answers/answers.module';
import { PlaySessionsModule } from '../play-sessions/play-sessions.module';
import { ResultsModule } from '../results/results.module';
import { QuizzesController } from './quizzes.controller';
import { QuizGateway } from './quizzes.gateway';
import { QuizzesService } from './quizzes.service';
import { QuizRepository } from './quiz.repository';
import { Quiz } from './quiz.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [PlaySessionsModule, AnswersModule, ResultsModule,TypeOrmModule.forFeature([Quiz])],
  providers: [QuizzesService, QuizGateway,QuizRepository],
  controllers: [QuizzesController],
})
export class QuizzesModule {}
