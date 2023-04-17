import { Module } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from './quiz.entity';
import { QuizzesController } from './quizzes.controller';
import { Answer } from 'src/answers/answer.entity';
import { Report } from 'src/reports/report.entity';
import { QuizGateway } from './quizzes.gateway';
import { PlaySessionsModule } from 'src/play-sessions/play-sessions.module';
import { AnswersModule } from 'src/answers/answers.module';
import { ResultsModule } from 'src/results/results.module';

@Module({
  imports: [TypeOrmModule.forFeature([Quiz,Answer,Report]), PlaySessionsModule, AnswersModule,ResultsModule],
  providers: [QuizzesService,QuizGateway],
  controllers: [QuizzesController]
})
export class QuizzesModule {}
