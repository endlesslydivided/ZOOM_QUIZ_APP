import {
  Injectable
} from '@nestjs/common';
import { DataSource, QueryRunner, TypeORMError } from 'typeorm';

import { CreateResultDTO } from './createResult.dto';
import { Result } from './result.entity';
import { ResultRepository } from './result.repository';

@Injectable()
export class ResultsService {
  constructor(
    private dataSource: DataSource,
    private resultRepository: ResultRepository,
  ) {}

  async createResult(dto: CreateResultDTO): Promise<Result> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const answerResult: Result =
        this.resultRepository.createResultEntity(dto);
      const result: Result = await queryRunner.manager.save(answerResult);

      await queryRunner.commitTransaction();

      return result;
    } catch (e: unknown) {
      await queryRunner.rollbackTransaction();
      if (e instanceof TypeORMError) {
        console.log(e.message);
      }
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
