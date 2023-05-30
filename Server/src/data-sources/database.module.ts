import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {typeOrmPostgresConfig} from './postgresMigrations/typeOrm.postgres.config';

const PostgreDBModule = TypeOrmModule.forRoot(
  typeOrmPostgresConfig
);


@Module({
  imports:[PostgreDBModule],
  exports: [PostgreDBModule],
})
export class DatabaseModule {}