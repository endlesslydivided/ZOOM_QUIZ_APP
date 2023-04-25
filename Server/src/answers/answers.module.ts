import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from './answer.entity';
import { Quiz } from 'src/quizzes/quiz.entity';
import { Result } from 'src/results/result.entity';

@Module({
})
export class AnswersModule {}
