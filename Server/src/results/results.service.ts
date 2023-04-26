import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource, QueryRunner, TypeORMError } from 'typeorm';
import { CreateResultDTO } from './dto/CreateResult.dto';
import { PlaySession } from '../play-sessions/playSession.entity';
import { Result } from './result.entity';
import { Answer } from '../answers/answer.entity';

@Injectable()
export class ResultsService {
  constructor(private dataSource: DataSource) {}

  async createResult(dto: CreateResultDTO): Promise<Result> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const playSession: PlaySession = await this.dataSource
      .getRepository(PlaySession)
      .findOneBy({ id: dto.playSessionId })
      .catch((error: TypeORMError) => {
        console.log(error);
        throw new InternalServerErrorException(
          'Result isn`t created. Internal server error occure',
        );
      });

    const answer: Answer = await this.dataSource
      .getRepository(Answer)
      .findOneBy({ id: dto.answerId })
      .catch((error: TypeORMError) => {
        console.log(error);
        throw new InternalServerErrorException(
          'Result isn`t created. Internal server error occure',
        );
      });

    const answerResult: Result = new Result();

    answerResult.playSession = playSession;
    answerResult.userId = dto.userId;
    answerResult.answer = answer;

    const result: Result = await queryRunner.manager
      .save(answerResult)
      .catch(async (error: TypeORMError) => {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
        throw new InternalServerErrorException(
          'Result entry is not created. Internal server error occured.',
        );
      });

    await queryRunner.commitTransaction();
    await queryRunner.release();

    return result;
  }
}
