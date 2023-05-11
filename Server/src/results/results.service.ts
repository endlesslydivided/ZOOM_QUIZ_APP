import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource, QueryRunner, TypeORMError } from 'typeorm';

import { Answer } from '../answers/answer.entity';
import { PlaySession } from '../play-sessions/playSession.entity';
import { CreateResultDTO } from './createResult.dto';
import { Result } from './result.entity';

@Injectable()
export class ResultsService {
  constructor(private dataSource: DataSource) {}

  async createResult(dto: CreateResultDTO): Promise<Result> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const playSession: PlaySession = await this.dataSource
        .getRepository(PlaySession)
        .findOneBy({ id: dto.playSessionId });

      const answer: Answer = await this.dataSource
        .getRepository(Answer)
        .findOneBy({ id: dto.answerId });

      const answerResult: Result = new Result();

      answerResult.playSession = playSession;
      answerResult.userId = dto.userId;
      answerResult.answer = answer;

      const result: Result = await queryRunner.manager.save(answerResult);

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return result;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      console.log(e.message);
      throw new InternalServerErrorException(
        'Result entry is not created. Internal server error occured.',
      );
    }
  }
}
