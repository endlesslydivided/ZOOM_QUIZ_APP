import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

import DBQueryParameters from '../share/requestFeatures/dbquery.params';
import { CreatePlaySessionDTO } from './createPlaySession.dto';
import { PlaySession } from './playSession.entity';

@Injectable()
export class PlaySessionRepository {
  constructor(
    @InjectRepository(PlaySession)
    private playSessionRepository: Repository<PlaySession>,
  ) {}

  createPlaySessionEntity(playSessionDto: CreatePlaySessionDTO): PlaySession {
    return this.playSessionRepository.create({ ...playSessionDto });
  }

  async findOneById(id: string): Promise<PlaySession> {
    return await this.playSessionRepository.findOneBy({ id });
  }

  async findOneByMeetAndQuiz(
    meetId: string,
    quizId: string,
  ): Promise<PlaySession> {
    return await this.playSessionRepository.findOne({
      where: { quiz: { id: quizId }, meetId },
    });
  }

  async softDeletePlaySession(id: string): Promise<UpdateResult> {
    return await this.playSessionRepository.softDelete(id);
  }

  async findAndCountPlaySessionResultsByUser(
    filters: DBQueryParameters,
    userId: string,
  ): Promise<[PlaySession[], number]> {
    return await this.playSessionRepository
      .createQueryBuilder('playSessions')
      .withDeleted()
      .leftJoinAndSelect('playSessions.quiz', 'quiz')
      .leftJoinAndSelect('quiz.answers', 'answers')
      .leftJoinAndSelect(
        'playSessions.results',
        'result',
        'result.userId = :userId',
        { userId },
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
  }

  async findPlaySessionsByUserAndMeet(
    userId: string,
    meetId: string,
  ): Promise<PlaySession[]> {
    return await this.playSessionRepository
      .createQueryBuilder('playSessions')
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
        { userId },
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
      .where('playSessions.meetId = :meetId', { meetId })
      .getMany();
  }

  async findPlaySessionsResultsById(id: string): Promise<PlaySession> {
    return await this.playSessionRepository
      .createQueryBuilder('playSessions')
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
        playSessionId: id,
      })
      .getOne();
  }
}
