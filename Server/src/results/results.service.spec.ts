import { Test, TestingModule } from '@nestjs/testing';
import { createStubInstance } from 'sinon';
import { PlaySession } from 'src/play-sessions/playSession.entity';
import * as typeorm from 'typeorm';
import { DataSource } from 'typeorm';

import { Answer } from '../answers/answer.entity';
import { Quiz } from '../quizzes/quiz.entity';
import { CreateResultDTO } from './createResult.dto';
import { Result } from './result.entity';
import { ResultsService } from './results.service';

describe('ResultsService', () => {
  let service: ResultsService;

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
    answers: answersMock,
    playSessions: [],
  };

  const resultMock: Result = {
    id: 'b31f1eff-d6bd-489c-963f-6ea188a25350',
    userId: '5kr3pKiqSCCa577PrBOnog',
    createdAt: new Date('2023-04-21 13:02:11.588832'),
    updatedAt: new Date('2023-04-21 13:02:11.588832'),
    answer: answersMock[0],
    playSession: null,
  };

  const playSessionMock: PlaySession = {
    id: 'c4e43811-0fb6-4738-b668-24b5a27296e9',
    meetId: 'wEBqRUY1RG2OKwusBIUP1g==',
    createdAt: new Date('2023-04-21 13:02:01.811647'),
    updatedAt: new Date('2023-04-21 13:02:01.811647'),
    quiz: quizMock,
    results: [],
  };

  const dataSourceStub: DataSource = createStubInstance(typeorm.DataSource);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResultsService,
        {
          provide: DataSource,
          useValue: dataSourceStub,
        },
      ],
    }).compile();

    service = module.get<ResultsService>(ResultsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createResult', () => {
    const resultDto: CreateResultDTO = {
      answerId: answersMock[0].id,
      userId: resultMock.userId,
      playSessionId: playSessionMock.id,
    };

    const manager = new typeorm.EntityManager(dataSourceStub);

    it('should create a result', async () => {
      manager.save = jest.fn().mockResolvedValue(resultMock);

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

          if (isQuiz) {
            return {
              ...original,
              findOneBy: jest.fn().mockResolvedValue(quizMock),
            };
          } else {
            return {
              ...original,
              findOneBy: jest.fn().mockResolvedValue(answersMock),
            };
          }
        });

      const newResult: Result = await service.createResult(resultDto);

      expect(dataSourceStub.createQueryRunner).toHaveBeenCalledTimes(1);
      expect(manager.save).toHaveBeenCalledTimes(1);
      expect(newResult).toEqual(resultMock);
    });

    it('should throw an error if result answer is undefined', async () => {
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

          if (isQuiz) {
            return { ...original, findOneBy: jest.fn() };
          } else {
            return {
              ...original,
              findOneBy: jest.fn().mockResolvedValue(answersMock),
            };
          }
        });

      await expect(service.createResult(resultDto)).rejects.toThrow(TypeError);
    });

    it('should throw an error if result quiz is undefined', async () => {
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

          if (isQuiz) {
            return {
              ...original,
              findOneBy: jest.fn().mockResolvedValue(quizMock),
            };
          } else {
            return { ...original, findOneBy: jest.fn() };
          }
        });

      await expect(service.createResult(resultDto)).rejects.toThrow(TypeError);
    });
  });
});
