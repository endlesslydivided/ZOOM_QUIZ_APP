import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { Answer } from '../../answers/answer.entity';
import { Quiz } from '../../quizzes/quiz.entity';
import { PlaySession } from '../../play-sessions/playSession.entity';
import { Result } from '../../results/result.entity';
import { RemoveAnswerIsCorrect1685354501341 } from './1685354501341-RemoveAnswerIsCorrect';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
 
config();
 
const configService = new ConfigService();
 
export const typeOrmPostgresConfig:TypeOrmModuleOptions = {
  type: 'postgres',
  host: configService.get('POSTGRES_HOST'),
  port: configService.get('POSTGRES_PORT'),
  username: configService.get('POSTGRES_USER'),
  password: configService.get('POSTGRES_PASSWORD'),
  database: configService.get('POSTGRES_DB'),
  entities: [Answer,Quiz,PlaySession,Result],
  migrations:[RemoveAnswerIsCorrect1685354501341]
};

export default new DataSource((typeOrmPostgresConfig as DataSourceOptions));

