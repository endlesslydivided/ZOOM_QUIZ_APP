import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';

import { ZoomContext } from '../auth/decorators/zoomContext.decorator';
import DBQueryParameters from '../share/requestFeatures/dbquery.params';
import { CreatePlaySessionDTO } from './createPlaySession.dto';
import { Report } from './interfaces';
import { PlaySessionRepository } from './play-sessions.repository';
import { PlaySession } from './playSession.entity';

@Injectable()
export class PlaySessionsService {
  constructor(
    private dataSource: DataSource,
    private playSessionRepository: PlaySessionRepository,
  ) {}

  async createPlaySession(dto: CreatePlaySessionDTO): Promise<PlaySession> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const playSessionCandidate: PlaySession =
        await this.playSessionRepository.findOneByMeetAndQuiz(
          dto.meetId,
          dto.quizId,
        );

      if (playSessionCandidate) {
        throw new BadRequestException('Quiz is already activated');
      }

      const playSession: PlaySession =
        this.playSessionRepository.createPlaySessionEntity(dto);
      const playSessionResult: PlaySession = await queryRunner.manager.save(
        playSession,
      );

      await queryRunner.commitTransaction();
      return playSessionResult;
    } catch (e: unknown) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async getPlaySessionsResults(
    filters: DBQueryParameters,
    context: ZoomContext,
  ): Promise<[PlaySession[], number]> {
    return await this.playSessionRepository.findAndCountPlaySessionResultsByUser(
      filters,
      context.uid,
    );
  }

  async getPlaySessions(context: ZoomContext): Promise<PlaySession[]> {
    return await this.playSessionRepository.findPlaySessionsByUserAndMeet(
      context.uid,
      context.mid,
    );
  }

  async getPlaySessionReport(playSessionId: string): Promise<Report> {
    const playSessionResults =
      await this.playSessionRepository.findPlaySessionsResultsById(
        playSessionId,
      );

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
