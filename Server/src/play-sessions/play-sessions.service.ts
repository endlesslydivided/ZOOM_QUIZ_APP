import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, QueryRunner, TypeORMError } from 'typeorm';

import { ZoomContext } from '../auth/decorators/zoomContext.decorator';
import { Quiz } from '../quizzes/quiz.entity';
import DBQueryParameters from '../share/requestFeatures/dbquery.params';
import { CreatePlaySessionDTO } from './createPlaySession.dto';
import { Report } from './interfaces';
import { PlaySession } from './playSession.entity';

@Injectable()
export class PlaySessionsService {
  constructor(private dataSource: DataSource) {}

  async createPlaySession(dto: CreatePlaySessionDTO): Promise<PlaySession> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const quiz: Quiz = await this.dataSource
      .getRepository(Quiz)
      .findOne({ where: { id: dto.quizId }, relations: ['answers'] });

    const playSessionCandidate: PlaySession = await this.dataSource
      .getRepository(PlaySession)
      .findOne({
        where: { quiz: { id: quiz.id }, meetId: dto.meetId },
      });

    if (playSessionCandidate) {
      throw new BadRequestException('Quiz is already activated');
    }

    const playSession: PlaySession = new PlaySession();

    playSession.meetId = dto.meetId;
    playSession.quiz = quiz;

    const playSessionResult: PlaySession = await queryRunner.manager
      .save(playSession)
      .catch(async (error: TypeORMError) => {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
        throw new InternalServerErrorException(
          'PlaySession is not created. Internal server error occured.',
        );
      });

    await queryRunner.commitTransaction();
    await queryRunner.release();
    return playSessionResult;
  }

  async getPlaySessionsResults(
    filters: DBQueryParameters,
    context: ZoomContext,
  ): Promise<[PlaySession[], number]> {
    const playSessionsResults: [PlaySession[], number] = await this.dataSource
      .createQueryBuilder(PlaySession, 'playSessions')
      .withDeleted()
      .leftJoinAndSelect('playSessions.quiz', 'quiz')
      .leftJoinAndSelect('quiz.answers', 'answers')
      .leftJoinAndSelect(
        'playSessions.results',
        'result',
        'result.userId = :userId',
        { userId: context.uid },
      )
      .leftJoinAndSelect('result.answer', 'answer')
      .select([
        `playSessions.id`,
        `playSessions.meetId`,
        `playSessions.createdAt`,
        `quiz.id`,
        `quiz.userId`,
        `quiz.text`,
        `quiz.createdAt`,
        `answers.id`,
        `answers.text`,
        `answers.isCorrect`,
        `result.id`,
        `result.createdAt`,
        `answer.id`,
        `answer.isCorrect`,
      ])
      .take(filters.limit)
      .skip(filters.offset)
      .getManyAndCount();

    return playSessionsResults;
  }

  async getPlaySessions(context: ZoomContext): Promise<PlaySession[]> {
    const playSessions: PlaySession[] = await this.dataSource
      .createQueryBuilder(PlaySession, 'playSessions')
      .leftJoinAndSelect(
        'playSessions.quiz',
        'quiz',
        'quiz.deletedAt IS NOT NULL',
      )
      .leftJoinAndSelect('quiz.answers', 'answers')
      .leftJoinAndSelect(
        'playSessions.results',
        'result',
        'result.userId = :userId',
        { userId: context.uid },
      )
      .leftJoinAndSelect('result.answer', 'answer')
      .select([
        `playSessions.id`,
        `playSessions.meetId`,
        `playSessions.createdAt`,
        `quiz.id`,
        `quiz.userId`,
        `quiz.text`,
        `quiz.createdAt`,
        `answers.id`,
        `answers.text`,
        `answers.isCorrect`,
        `result.id`,
        `result.createdAt`,
        `answer.id`,
        `answer.isCorrect`,
      ])
      .where('playSessions.meetId = :meetId', { meetId: context.mid })
      .getMany();
    return playSessions;
  }

  async getPlaySessionReport(playSessionId: string): Promise<Report> {
    const playSessionResults: PlaySession = await this.dataSource
      .createQueryBuilder(PlaySession, 'playSessions')
      .leftJoinAndSelect('playSessions.results', 'result')
      .leftJoinAndSelect('result.answer', 'answer')
      .select([
        `playSessions.id`,
        `playSessions.meetId`,
        `playSessions.createdAt`,
        `result.id`,
        `result.createdAt`,
        `answer.id`,
        `answer.isCorrect`,
      ])
      .where('playSessions.id = :playSessionId', {
        playSessionId: playSessionId,
      })
      .getOne();

    const report: Report = {
      correctAnswersCount: playSessionResults.results.reduce(
        (a, i) => (i.answer.isCorrect ? ++a : a),
        0,
      ),
      incorrectAnswersCount: playSessionResults.results.reduce(
        (a, i) => (i.answer.isCorrect ? a : ++a),
        0,
      ),
      overallAnswersCount: playSessionResults.results.length,
    };

    return report;
  }
}
