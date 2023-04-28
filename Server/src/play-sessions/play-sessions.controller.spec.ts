import { Answer } from "../answers/answer.entity";
import { Quiz } from "../quizzes/quiz.entity";
import { Result } from "../results/result.entity";
import { PlaySessionsController } from "./play-sessions.controller";
import { PlaySession } from "./playSession.entity";
import { PlaySessionsService } from "./play-sessions.service";
import { Test } from "@nestjs/testing";
import { ZoomContext } from "../auth/decorators/zoomContext.decorator";
import { Report } from "./interfaces/interfaces";
import QueryParameters from "../requestFeatures/query.params";
import { BadGatewayException, BadRequestException, HttpException, HttpStatus } from "@nestjs/common";

describe('PlaySessionsController', () => {
    let controller: PlaySessionsController;

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

    const quizMock:Quiz = {
    id:'db16f3f6-25bb-477a-9ec3-0f55455613a9',
    userId:'5kr3pKiqSCCa577PrBOnog',
    text:'What is the closest planet to Sun?',
    createdAt:new Date('2023-04-18 15:39:46.587492'),
    updatedAt:new Date('2023-04-20 13:07:42.965826'),
    deletedAt: null,
    playSessions:[],
    answers:answersMock
    }

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
    quiz:quizMock,
    results:resultsMock
    }

    const playSessionReportMock:Report ={
        correctAnswersCount: 1,
        incorrectAnswersCount: 1,
        overallAnswersCount: 2,
    }

    const mockPlaySessionsService={
        createPlaySession:jest.fn().mockResolvedValue(playSessionMock),
        getPlaySessionsResults:jest.fn().mockResolvedValue([resultsMock,1]),
        getPlaySessions:jest.fn().mockResolvedValue([playSessionMock,1]),
        getPlaySessionReport:jest.fn().mockResolvedValue(playSessionReportMock),
    }


    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [PlaySessionsController],
            providers: [PlaySessionsService],
        })
            .overrideProvider(PlaySessionsService)
            .useValue(mockPlaySessionsService)
            .compile();
    
        controller = module.get<PlaySessionsController>(PlaySessionsController);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getResults',() =>
    {
        const query:QueryParameters = {
            limit:10,
            page:1,
            createdAt:null
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

        it('should get play sessions results', async () => {
            const playSessionResults =  await controller.getPlaySessionsResults(zoomContext,query);

            expect(mockPlaySessionsService.getPlaySessionsResults).toHaveBeenCalledTimes(1);
            expect(mockPlaySessionsService.getPlaySessionsResults).toHaveBeenCalledWith(
                query,
                zoomContext
            );
            expect(playSessionResults).toEqual([resultsMock,1]);
        });

    })

    describe('getPlaySessions',() =>
    {
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

        it('should get play sessions', async () => {
            const playSessionsResults = await controller.getPlaySessions(zoomContext);

            expect(mockPlaySessionsService.getPlaySessions).toHaveBeenCalledTimes(1);
            expect(mockPlaySessionsService.getPlaySessions).toHaveBeenCalledWith(
                zoomContext
            );
            expect(playSessionsResults).toEqual([playSessionMock,1]);
        });
    })

    describe('getPlaySessionReport',() =>
    {
        const playSessionId = 'c4e43811-0fb6-4738-b668-24b5a27296e9';

        it('should get one play session report', async () => {
            const playSessionReport=  await controller.getPlaySessionReport(playSessionId);

            expect(mockPlaySessionsService.getPlaySessionReport).toHaveBeenCalledTimes(1);
            expect(mockPlaySessionsService.getPlaySessionReport).toHaveBeenCalledWith(
                playSessionId
            );
            expect(playSessionReport).toEqual(playSessionReportMock);
        });

    })
})