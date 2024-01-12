import { Inject, Injectable } from '@nestjs/common';
import { DataSource, QueryRunner, UpdateResult } from 'typeorm';

import { Answer } from '../answers/answer.entity';
import { AnswerRepository } from '../answers/answer.repository';
import { ZoomContext } from '../auth/decorators/zoomContext.decorator';
import DBQueryParameters from '../share/requestFeatures/dbquery.params';
import { CreateQuizDTO } from './createQuiz.dto';
import { Quiz } from './quiz.entity';
import { QuizRepository } from './quiz.repository';

@Injectable()
export class QuizzesService {
  constructor(
    private dataSource: DataSource,
    @Inject(AnswerRepository) private answerRepository: AnswerRepository,
    private quizRepository: QuizRepository,
  ) {}

  async createQuiz(
    quizDto: CreateQuizDTO,
    context: ZoomContext,
  ): Promise<Quiz> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const answers: Answer[] = await Promise.all(
        quizDto.answers.map(async (answerDto) => {
          const answer: Answer =
            this.answerRepository.createAnswerEntity(answerDto);

          return await queryRunner.manager.save(answer);
        }),
      );

      const quiz = this.quizRepository.createQuizEntity(
        quizDto,
        answers,
        context,
      );
      const quizResult: Quiz = await queryRunner.manager.save(quiz);

      await queryRunner.commitTransaction();

      return quizResult;
    } catch (e: unknown) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async getUserQuizzes(
    filters: DBQueryParameters,
    context: ZoomContext,
  ): Promise<[Quiz[], number]> {
    return await this.quizRepository.findAndCount(filters, context);
  }

  async getOneQuiz(quizId: string): Promise<Quiz> {
    return await this.quizRepository.findOneById(quizId);
  }

  async getQuizAnswers(quizId: string): Promise<Answer[]> {
    return await this.answerRepository.findAnswersByQuizId(quizId);
  }

  async deleteQuiz(quizId: string): Promise<UpdateResult> {
    return await this.quizRepository.softDeleteQuiz(quizId);
  }
}
