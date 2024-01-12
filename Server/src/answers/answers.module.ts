import { Module } from '@nestjs/common';

import { AnswerRepository } from './answer.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from './answer.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Answer])],
  providers: [AnswerRepository],
  exports: [AnswerRepository],
})
export class AnswersModule {}
