import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { createStubInstance } from 'sinon';
import { ZoomContext } from 'src/auth/decorators/zoomContext.decorator';
import * as typeorm from 'typeorm';
import { DataSource } from 'typeorm';

import { Answer } from '../answers/answer.entity';
import { Quiz } from '../quizzes/quiz.entity';
import { Result } from '../results/result.entity';
import { CreatePlaySessionDTO } from './createPlaySession.dto';
import { Report } from './interfaces';
import { PlaySessionsService } from './play-sessions.service';
import { PlaySession } from './playSession.entity';

describe('PlaySessionsService', () => {
  let service: PlaySessionsService;

  const answersMock: Answer[] = [
    {
      id: '40698f15-60e7-4aa4-8553-e1400cd16b43',
      text: 'Mercury',
      isCorrect: true,
      quiz: null,
      results: null,
    },
    {
      id: '5492fdcf-e3f3-48bc-a6b1-5efde62e8133',
      text: 'Earth',
      isCorrect: false,
      quiz: null,
      results: null,
    },
    {
      id: 'd92bb7d6-a02a-4ac0-96cc-c4e593582438',
      text: 'Mars',
      isCorrect: false,
      quiz: null,
      results: null,
    },
    {
      id: '26e55e33-8801-4dcd-8f0e-25ea8feb7dda',
      text: 'Upiter',
      isCorrect: false,
      quiz: null,
      results: null,
    },
  ];

  const quizMock: Quiz = {
    id: 'db16f3f6-25bb-477a-9ec3-0f55455613a9',
    userId: '5kr3pKiqSCCa577PrBOnog',
    text: 'What is the closest planet to Sun?',
    createdAt: new Date('2023-04-18 15:39:46.587492'),
    updatedAt: new Date('2023-04-20 13:07:42.965826'),
    deletedAt: null,
    playSessions: [],
    answers: answersMock,
  };

  const resultsMock: Result[] = [
    {
      id: 'b31f1eff-d6bd-489c-963f-6ea188a25350',
      userId: '5kr3pKiqSCCa577PrBOnog',
      createdAt: new Date('2023-04-21 13:02:11.588832'),
      updatedAt: new Date('2023-04-21 13:02:11.588832'),
      answer: answersMock[0],
      playSession: null,
    },
    {
      id: '16a76a88-4c19-4ab9-b806-55b5895bd043',
      userId: '6kr3pKiqSCCa5775rBOnog',
      createdAt: new Date('2023-04-21 14:05:02.686495'),
      updatedAt: new Date('2023-04-21 14:05:02.686495'),
      answer: answersMock[1],
      playSession: null,
    },
  ];

  const playSessionMock: PlaySession = {
    id: 'c4e43811-0fb6-4738-b668-24b5a27296e9',
    meetId: 'wEBqRUY1RG2OKwusBIUP1g==',
    createdAt: new Date('2023-04-21 13:02:01.811647'),
    updatedAt: new Date('2023-04-21 13:02:01.811647'),
    quiz: quizMock,
    results: resultsMock,
  };

  const dataSourceStub: DataSource = createStubInstance(typeorm.DataSource);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlaySessionsService,
        {
          provide: DataSource,
          useValue: dataSourceStub,
        },
      ],
    }).compile();

    service = module.get<PlaySessionsService>(PlaySessionsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPlaySessionsResults', () => {
    const filters = {
      limit: 10,
      offset: 0,
    };

    const zoomContext: ZoomContext = {
      uid: '5kr3pKiqSCCa577PrBOnog',
      aud: null,
      entitlements: null,
      exp: null,
      iss: null,
      theme: null,
      ts: null,
      typ: null,
    };

    it('should return play session results by user', async () => {
      const mockQueryBuilder = jest.fn().mockImplementation(() => ({
        createQueryBuilder: jest.fn().mockReturnThis(),
        withDeleted: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([playSessionMock, 1]),
      }));

      const queryBuilderSpy = jest
        .spyOn(dataSourceStub, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder());

      const playSessionResults: [PlaySession[], number] =
        await service.getPlaySessionsResults(filters, zoomContext);

      expect(queryBuilderSpy).toHaveBeenCalledTimes(1);
      expect(playSessionResults).toEqual([playSessionMock, 1]);
    });
  });

  describe('getPlaySessionsResults', () => {
    const zoomContext: ZoomContext = {
      uid: '5kr3pKiqSCCa577PrBOnog',
      aud: null,
      entitlements: null,
      exp: null,
      iss: null,
      theme: null,
      ts: null,
      typ: null,
    };

    it('should return play sessions by user', async () => {
      const mockQueryBuilder = jest.fn().mockImplementation(() => ({
        createQueryBuilder: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([playSessionMock]),
      }));

      const queryBuilderSpy = jest
        .spyOn(dataSourceStub, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder());

      const playSessionsResult: PlaySession[] = await service.getPlaySessions(
        zoomContext,
      );

      expect(queryBuilderSpy).toHaveBeenCalledTimes(1);
      expect(playSessionsResult).toEqual([playSessionMock]);
    });
  });

  describe('getPlaySessionsReport', () => {
    const playSessionId = 'c4e43811-0fb6-4738-b668-24b5a27296e9';
    const playSessionReport: Report = {
      correctAnswersCount: 1,
      incorrectAnswersCount: 1,
      overallAnswersCount: 2,
    };

    it('should return play session report', async () => {
      const mockQueryBuilder = jest.fn().mockImplementation(() => ({
        createQueryBuilder: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(playSessionMock),
      }));

      const queryBuilderSpy = jest
        .spyOn(dataSourceStub, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder());

      const playSessionReportResult: Report =
        await service.getPlaySessionReport(playSessionId);

      expect(queryBuilderSpy).toHaveBeenCalledTimes(1);
      expect(playSessionReportResult).toEqual(playSessionReport);
    });
  });

  describe('createPlaySession', () => {
    const playSessionDto: CreatePlaySessionDTO = {
      quizId: quizMock.id,
      meetId: playSessionMock.meetId,
    };

    const manager = new typeorm.EntityManager(dataSourceStub);

    it('should create a play session', async () => {
      manager.save = jest.fn().mockResolvedValue(playSessionMock);

      const mockCreateQueryRunner = jest.fn().mockImplementation(() => ({
        connect: jest.fn(),
        release: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        manager: manager,
      }));

      jest
        .spyOn(dataSourceStub, 'createQueryRunner')
        .mockReturnValue(mockCreateQueryRunner());

      jest
        .spyOn(dataSourceStub, 'getRepository')
        .mockImplementation((target) => {
          const original = jest.requireActual('typeorm');
          const isQuiz = !!target.toString().match(/Quiz/g);
          return isQuiz
            ? {
                ...original,
                findOne: jest.fn().mockResolvedValue(quizMock),
              }
            : {
                ...original,
                findOne: jest.fn(),
              };
        });

      const playSessionResult: PlaySession = await service.createPlaySession(
        playSessionDto,
      );

      expect(dataSourceStub.createQueryRunner).toHaveBeenCalledTimes(1);
      expect(manager.save).toHaveBeenCalledTimes(1);
      expect(playSessionResult).toEqual(playSessionMock);
    });

    it('throw an error if playSessionCandidate is not null', async () => {
      manager.save = jest.fn().mockResolvedValue(playSessionMock);

      const mockCreateQueryRunner = jest.fn().mockImplementation(() => ({
        connect: jest.fn(),
        release: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        manager: manager,
      }));

      jest
        .spyOn(dataSourceStub, 'createQueryRunner')
        .mockReturnValue(mockCreateQueryRunner());

      jest
        .spyOn(dataSourceStub, 'getRepository')
        .mockImplementation((target) => {
          const original = jest.requireActual('typeorm');
          const isQuiz = !!target.toString().match(/Quiz/g);
          return isQuiz
            ? {
                ...original,
                findOne: jest.fn().mockResolvedValue(quizMock),
              }
            : {
                ...original,
                findOne: jest.fn().mockResolvedValue(playSessionMock),
              };
        });

      await expect(service.createPlaySession(playSessionDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('throw an error if play session quiz is undefined', async () => {
      manager.save = jest.fn();

      const mockCreateQueryRunner = jest.fn().mockImplementation(() => ({
        connect: jest.fn(),
        release: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        manager: manager,
      }));

      jest
        .spyOn(dataSourceStub, 'createQueryRunner')
        .mockReturnValue(mockCreateQueryRunner());

      jest
        .spyOn(dataSourceStub, 'getRepository')
        .mockImplementation((target) => {
          const original = jest.requireActual('typeorm');
          const isQuiz = !!target.toString().match(/Quiz/g);
          return isQuiz
            ? {
                ...original,
                findOne: jest.fn(),
              }
            : {
                ...original,
                findOne: jest.fn(),
              };
        });

      await expect(service.createPlaySession(playSessionDto)).rejects.toThrow(
        TypeError,
      );
    });

    it('throw an error if playSession dto is incorrect', async () => {
      manager.save = jest.fn().mockRejectedValue(new Error('Example error'));

      const mockCreateQueryRunner = jest.fn().mockImplementation(() => ({
        connect: jest.fn(),
        release: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        manager: manager,
      }));

      jest
        .spyOn(dataSourceStub, 'createQueryRunner')
        .mockReturnValue(mockCreateQueryRunner());

      jest
        .spyOn(dataSourceStub, 'getRepository')
        .mockImplementation((target) => {
          const original = jest.requireActual('typeorm');
          const isQuiz = !!target.toString().match(/Quiz/g);
          return isQuiz
            ? {
                ...original,
                findOne: jest.fn().mockResolvedValue(quizMock),
              }
            : {
                ...original,
                findOne: jest.fn(),
              };
        });

      await expect(service.createPlaySession(playSessionDto)).rejects.toThrow(
        Error,
      );
    });
  });
});
