import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

import { Answer } from '../answers/answer.entity';
import { ZoomContext } from '../auth/decorators/zoomContext.decorator';
import DBQueryParameters from '../share/requestFeatures/dbquery.params';
import { CreateQuizDTO } from './createQuiz.dto';
import { Quiz } from './quiz.entity';

@Injectable()
export class QuizRepository {
  constructor(
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
  ) {}

  createQuizEntity(
    quizDto: CreateQuizDTO,
    answers: Answer[],
    context: ZoomContext,
  ): Quiz {
    return this.quizRepository.create({
      ...quizDto,
      answers,
      userId: context.uid,
    });
  }

  async findAndCount(
    filters: DBQueryParameters,
    context: ZoomContext,
  ): Promise<[Quiz[], number]> {
    return await this.quizRepository.findAndCount({
      take: filters.limit,
      skip: filters.offset,
      where: { userId: context.uid },
      relations: { answers: true, playSessions: true },
    });
  }

  async findOneById(id: string): Promise<Quiz> {
    return await this.quizRepository.findOneBy({ id });
  }

  async findAnswersByQuiz(id: string): Promise<Quiz> {
    return await this.quizRepository.findOne({
      where: { id },
      relations: ['answers'],
    });
  }

  async softDeleteQuiz(id: string): Promise<UpdateResult> {
    return await this.quizRepository.softDelete(id);
  }
}
