import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Answer } from './answer.entity';
import { CreateAnswerDTO } from './createAnswer.dto';

@Injectable()
export class AnswerRepository {
  constructor(
    @InjectRepository(Answer)
    private answerRepository: Repository<Answer>,
  ) {}

  createAnswerEntity(answerDto: CreateAnswerDTO): Answer {
    return this.answerRepository.create(answerDto);
  }

  async findAnswersByQuizId(quizId: string): Promise<Answer[]> {
    return await this.answerRepository.findBy({ quiz: { id: quizId } });
  }
}
