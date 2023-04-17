import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from 'src/answers/answer.entity';
import { Quiz } from 'src/quizzes/quiz.entity';
import { Report } from './report.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Quiz,Answer,Report])],

})
export class ReportsModule {}
