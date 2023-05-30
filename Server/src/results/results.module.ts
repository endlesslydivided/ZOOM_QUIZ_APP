import { Module } from '@nestjs/common';

import { ResultsService } from './results.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Result } from './result.entity';
import { ResultRepository } from './result.repository';

@Module({
  imports:[TypeOrmModule.forFeature([Result])],
  providers: [ResultsService,ResultRepository],
  exports: [ResultsService],
})
export class ResultsModule {}
