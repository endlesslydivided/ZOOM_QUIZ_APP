import { Module } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from './quiz.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Quiz])],
  providers: [QuizzesService]
})
export class QuizzesModule {}
