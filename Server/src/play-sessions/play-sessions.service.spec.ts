import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { createStubInstance } from 'sinon';
import * as typeorm from 'typeorm';
import { DataSource } from 'typeorm';

import { Answer } from '../answers/answer.entity';
import { ZoomContext } from '../auth/decorators/zoomContext.decorator';
import { Quiz } from '../quizzes/quiz.entity';
import { Result } from '../results/result.entity';
import { CreatePlaySessionDTO } from './createPlaySession.dto';
import { Report } from './interfaces';
import { PlaySessionsService } from './play-sessions.service';
import { PlaySession } from './playSession.entity';
import { PlaySessionRepository } from './play-sessions.repository';

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

  const mockPlaySessionRepository = {
    createPlaySessionEntity:jest.fn().mockResolvedValue(playSessionMock),
    findOneById:jest.fn().mockResolvedValue(playSessionMock),
    findOneByMeetAndQuiz:jest.fn().mockResolvedValue(playSessionMock),
    softDeletePlaySession:jest.fn(),
    findAndCountPlaySessionResultsByUser:jest.fn().mockResolvedValue([playSessionMock,1]),
    findPlaySessionsByUserAndMeet:jest.fn().mockResolvedValue([playSessionMock]),
    findPlaySessionsResultsById:jest.fn().mockResolvedValue(playSessionMock)
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlaySessionsService,
        {
          provide: DataSource,
          useValue: dataSourceStub,
        },
        {
          provide: PlaySessionRepository,
          useValue: mockPlaySessionRepository,
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
      const playSessionResults: [PlaySession[], number] =
        await service.getPlaySessionsResults(filters, zoomContext);

      expect(mockPlaySessionRepository.findAndCountPlaySessionResultsByUser).toHaveBeenCalledTimes(1);
      expect(mockPlaySessionRepository.findAndCountPlaySessionResultsByUser).toBeCalledWith(filters,zoomContext.uid);

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
         const playSessionsResult: PlaySession[] = await service.getPlaySessions(
        zoomContext,
      );

      expect(mockPlaySessionRepository.findPlaySessionsByUserAndMeet).toHaveBeenCalledTimes(1);
      expect(mockPlaySessionRepository.findPlaySessionsByUserAndMeet).toBeCalledWith(zoomContext.uid,zoomContext.mid);

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
      const playSessionReportResult: Report =
        await service.getPlaySessionReport(playSessionId);

        expect(mockPlaySessionRepository.findPlaySessionsResultsById).toHaveBeenCalledTimes(1);
        expect(mockPlaySessionRepository.findPlaySessionsResultsById).toBeCalledWith(playSessionId);
        
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

      const findOneMock =  jest
        .spyOn(mockPlaySessionRepository, 'findOneByMeetAndQuiz')
        .mockReturnValue(null);


      const playSessionResult: PlaySession = await service.createPlaySession(
        playSessionDto,
      );

      expect(dataSourceStub.createQueryRunner).toHaveBeenCalledTimes(1);
      

      expect(findOneMock).toBeCalledWith(playSessionDto.meetId,playSessionDto.quizId);
      expect(findOneMock).toHaveBeenCalledTimes(1);

      expect(mockPlaySessionRepository.createPlaySessionEntity).toBeCalledWith(playSessionDto);
      expect(mockPlaySessionRepository.createPlaySessionEntity).toHaveBeenCalledTimes(1);

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
        .spyOn(mockPlaySessionRepository, 'findOneByMeetAndQuiz')
        .mockReturnValue(playSessionMock);

      await expect(service.createPlaySession(playSessionDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
