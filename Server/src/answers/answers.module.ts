import { Module } from '@nestjs/common';

import { AnswerRepository } from './answer.repository';

@Module({
  providers: [AnswerRepository],
  exports: [AnswerRepository],
})
export class AnswersModule {}
