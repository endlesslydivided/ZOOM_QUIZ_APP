import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from 'src/answers/answer.entity';
import { AnswersModule } from 'src/answers/answers.module';
import { PlaySessionsModule } from 'src/play-sessions/play-sessions.module';
import { Quiz } from './quiz.entity';
import { QuizzesController } from './quizzes.controller';
import { QuizGateway } from './quizzes.gateway';
import { QuizzesService } from './quizzes.service';
import { ResultsModule } from 'src/results/results.module';

@Module({
  imports: [TypeOrmModule.forFeature([Quiz,Answer]), PlaySessionsModule, AnswersModule,ResultsModule],
  providers: [QuizzesService,QuizGateway],
  controllers: [QuizzesController]
})
export class QuizzesModule {}
