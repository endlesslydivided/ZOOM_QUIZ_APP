import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { createStubInstance } from 'sinon';
import { ZoomContext } from 'src/auth/decorators/zoomContext.decorator';
import * as typeorm from 'typeorm';
import { DataSource } from 'typeorm';
import { Answer } from '../answers/answer.entity';
import { Result } from '../results/result.entity';

import { Quiz } from './quiz.entity';
import { QuizzesService } from './quizzes.service';
import { PlaySession } from 'src/play-sessions/playSession.entity';
import { CreateQuizDTO } from './dto/createQuiz.dto';


describe('QuizzesService', () => {
    let service: QuizzesService;

    const answersMock:Answer[] = [
      {
        id:'40698f15-60e7-4aa4-8553-e1400cd16b43',
        text:'Mercury',
        isCorrect:true,
        quiz:null,
        results:null
      },
      {
        id:'5492fdcf-e3f3-48bc-a6b1-5efde62e8133',
        text:'Earth',
        isCorrect:false,
        quiz:null,
        results:null
      },{
        id:'d92bb7d6-a02a-4ac0-96cc-c4e593582438',
        text:'Mars',
        isCorrect:false,
        quiz:null,
        results:null
      },
      {
        id:'26e55e33-8801-4dcd-8f0e-25ea8feb7dda',
        text:'Upiter',
        isCorrect:false,
        quiz:null,
        results:null
      }
    ]

    const resultsMock:Result[] =[
      {
        id:'b31f1eff-d6bd-489c-963f-6ea188a25350',
        userId:'5kr3pKiqSCCa577PrBOnog',
        createdAt:new Date('2023-04-21 13:02:11.588832'),
        updatedAt:new Date('2023-04-21 13:02:11.588832'),
        answer:answersMock[0],
        playSession:null
      },
      {
        id:'16a76a88-4c19-4ab9-b806-55b5895bd043',
        userId:'6kr3pKiqSCCa5775rBOnog',
        createdAt:new Date('2023-04-21 14:05:02.686495'),
        updatedAt:new Date('2023-04-21 14:05:02.686495'),
        answer:answersMock[1],
        playSession:null
      }
    ]
    
    const playSessionMock:PlaySession={
      id:'c4e43811-0fb6-4738-b668-24b5a27296e9',
      meetId:'wEBqRUY1RG2OKwusBIUP1g==',
      createdAt:new Date('2023-04-21 13:02:01.811647'),
      updatedAt:new Date('2023-04-21 13:02:01.811647'),
      quiz:null,
      results:resultsMock
    }

    const quizMock:Quiz = {
      id:'db16f3f6-25bb-477a-9ec3-0f55455613a9',
      userId:'5kr3pKiqSCCa577PrBOnog',
      text:'What is the closest planet to Sun?',
      createdAt:new Date('2023-04-18 15:39:46.587492'),
      updatedAt:new Date('2023-04-20 13:07:42.965826'),
      deletedAt: null,
      playSessions:[playSessionMock],
      answers:answersMock
    }

    const dataSourceStub: DataSource = createStubInstance(typeorm.DataSource);


    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers:[
          QuizzesService,
          {
            provide: DataSource,
            useValue:dataSourceStub
          }
        ]
      }).compile();

      service = module.get<QuizzesService>(QuizzesService);
      jest.clearAllMocks();
    })

    it('should be defined',() => {
      expect(service).toBeDefined();
    })


    describe('getUserQuizzes', () => {

      const filters = {
        limit:10,
        offset:0
      };
      const zoomContext:ZoomContext ={
        uid:'5kr3pKiqSCCa577PrBOnog',
        aud:null,
        entitlements: null,
        exp: null,
        iss:null,
        theme:null,
        ts: null,
        typ:null,
      };

      it('should return quizzes by user', async () =>
      {
        const quizRepositoryStub = jest
        .spyOn(dataSourceStub, 'getRepository')
        .mockImplementation((target) => {
          const original = jest.requireActual("typeorm");
          return {
            ...original,
            findAndCount: jest.fn().mockResolvedValue([quizMock,1]),
          }
        });
        
        const quizzes:[Quiz[],number] = await service.getUserQuizzes(filters,zoomContext);

        expect(quizRepositoryStub).toHaveBeenCalledTimes(1);
        expect(quizzes).toEqual([quizMock,1]);
      })

    })

    describe('getQuizAnswers', () => {

      const quizId = 'db16f3f6-25bb-477a-9ec3-0f55455613a9';

      it('should return quiz answers', async () =>
      {
        const answerRepositoryStub = jest
        .spyOn(dataSourceStub, 'getRepository')
        .mockImplementation((target) => {
          const original = jest.requireActual("typeorm");
          return {
            ...original,
            findBy: jest.fn().mockResolvedValue(answersMock),
          }
        });
        
        const answers:Answer[] = await service.getQuizAnswers(quizId);

        expect(answerRepositoryStub).toHaveBeenCalledTimes(1);
        expect(answers).toEqual(answersMock);
      })

    })

    describe('getOneQuiz', () => {
      const quizId = 'db16f3f6-25bb-477a-9ec3-0f55455613a9';

      it('should return one quiz', async () =>
      {

        const quizRepositoryStub = jest
        .spyOn(dataSourceStub, 'getRepository')
        .mockImplementation((target) => {
          const original = jest.requireActual("typeorm");
          return {
            ...original,
            findOneBy: jest.fn().mockResolvedValue(quizMock),
          }
        });
        
        const quiz:Quiz = await service.getOneQuiz(quizId);

        expect(quizRepositoryStub).toHaveBeenCalledTimes(1);
        expect(quiz).toEqual(quizMock);
      })
    })

    describe('deleteQuiz', () => {
      const quizId = 'db16f3f6-25bb-477a-9ec3-0f55455613a9';

      it('should delete quiz', async () =>
      {

        const quizRepositoryStub = jest
        .spyOn(dataSourceStub, 'getRepository')
        .mockImplementation((target) => {
          const original = jest.requireActual("typeorm");
          return {
            ...original,
            softDelete: jest.fn().mockResolvedValue(quizMock),
          }
        });
        
        const result:typeorm.UpdateResult = await service.deleteQuiz(quizId);

        expect(quizRepositoryStub).toHaveBeenCalledTimes(1);
        expect(result).toEqual(quizMock);
      })

    })

    describe('createQuiz',() => {
      const quizDto:CreateQuizDTO =
      {
        text: quizMock.text,
        answers: quizMock.answers
      };
      const zoomContext:ZoomContext ={
        uid:'5kr3pKiqSCCa577PrBOnog',
        aud:null,
        entitlements: null,
        exp: null,
        iss:null,
        theme:null,
        ts: null,
        typ:null,
      };

      const manager = new typeorm.EntityManager(dataSourceStub);

      it('should create a quiz',async () =>{
        
        manager.save = jest.fn().mockResolvedValue(quizMock);

        const mockCreateQueryRunner = jest.fn().mockImplementation(() => ({
          connect: jest.fn(),
          release: jest.fn(),
          startTransaction: jest.fn(),
          commitTransaction: jest.fn(),
          rollbackTransaction: jest.fn(),
          manager: manager
        }));

        jest
          .spyOn(dataSourceStub, 'createQueryRunner')
          .mockReturnValue(mockCreateQueryRunner());
          
        const quizResult:Quiz = await service.createQuiz(quizDto,zoomContext);

        expect(dataSourceStub.createQueryRunner).toHaveBeenCalledTimes(1);
        expect(manager.save).toHaveBeenCalledTimes(5);
        expect(quizResult).toEqual(quizMock);
      })
  })
 
});