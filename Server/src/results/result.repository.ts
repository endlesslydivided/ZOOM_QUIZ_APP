import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateResultDTO } from './createResult.dto';
import { Result } from './result.entity';

@Injectable()
export class ResultRepository {
  constructor(
    @InjectRepository(Result) private resultRepository: Repository<Result>,
  ) {}

  createResultEntity(resultDto: CreateResultDTO): Result {
    return this.resultRepository.create(resultDto);
  }
}
