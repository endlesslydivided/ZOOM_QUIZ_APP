import { forwardRef, Inject, Logger, UseFilters, UseGuards } from '@nestjs/common';
import {
    MessageBody,
    OnGatewayConnection, OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage, WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { ZoomContextGuard } from 'src/auth/guards/zoomContext.guard';
import { QuizzesService } from './quizzes.service';
import { CreatePlaySessionDTO } from 'src/play-sessions/dto/CreatePlaySession';
import { PlaySessionsService } from 'src/play-sessions/play-sessions.service';
import { ResultsService } from 'src/results/results.service';
import { CreateResultDTO } from 'src/results/dto/CreateResult.dto';
import { getAppContext } from 'src/utils/cipher';
import { ConnectedSocket } from '@nestjs/websockets';
import { ZoomMeetGuard } from 'src/auth/guards/zoomMeet.guard';
import { WsExceptionFilter } from 'src/exception/WsException.filter';

export enum QuizClientEvent 
{
    SERVER_SENDS_ANSWERS = 'SERVER_SENDS_ANSWER',
    SERVER_PROVIDES_QUIZ = 'SERVER_PROVIDES_QUIZ'
}

export enum QuizServerEvent 
{
    CLIENT_PROVIDES_QUIZ = 'CLIENT_PROVIDES_QUIZ',
    CLIENT_SENDS_ANSWER = 'CLIENT_SENDS_ANSWER'
}

type CreatePlaySessionMessage =
{
    playSession: CreatePlaySessionDTO;
}

type CreateResultMessage =
{
    result: CreateResultDTO;
}

@WebSocketGateway(
  {
    cors: { origin:  true, credentials: true, preflightContinue: false},path:"/play-quiz", 
    pingTimeout: 100000,
    maxHttpBufferSize: 1e8,
  })
export class QuizGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{

    private logger: Logger = new Logger('QuizGateway');



    constructor( @Inject(forwardRef(() => QuizzesService)) private quizzesService: QuizzesService,
    @Inject(forwardRef(() => PlaySessionsService)) private playSessionsService: PlaySessionsService,
    @Inject(forwardRef(() => ResultsService)) private resultsService: ResultsService)
    {

    }


    @WebSocketServer() 
    server: Server;

    @SubscribeMessage(QuizServerEvent.CLIENT_PROVIDES_QUIZ)
    async handleProvidesQuiz(@MessageBody() body: any & CreatePlaySessionMessage,
    @ConnectedSocket() client: Socket,
    ) 
    {
        const zoomContext = client.handshake.auth.context && getAppContext(client.handshake.auth.context);

        const playSessionQuiz = 
        await this.playSessionsService.createPlaySession({...body.playSession,meetId:zoomContext.mid});

        this.server.to(body?.meetId).emit(QuizClientEvent.SERVER_PROVIDES_QUIZ, playSessionQuiz);
    }

    @SubscribeMessage(QuizServerEvent.CLIENT_SENDS_ANSWER)
    async handleSendsAnswer(@MessageBody() body: any & CreateResultMessage,
    @ConnectedSocket() client: Socket) 
    {
        const zoomContext = client.handshake.auth.context && getAppContext(client.handshake.auth.context);


        const result = await this.resultsService.createResult({...body.result,userId:zoomContext.uid});
        const answers = await this.quizzesService.getQuizAnswers(result.playSession.quiz.id);

        this.server.to(body?.userid).emit(QuizClientEvent.SERVER_SENDS_ANSWERS, {results:[result],answers});
    }

    afterInit(server: Server) 
    {
        this.logger.log('Init');
    }

    handleDisconnect(client: Socket) 
    {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    

    @UseGuards(ZoomContextGuard)
    handleConnection(client: Socket, ...args: any[]) 
    {
        const auth = client.handshake.auth;
        const zoomContext = auth.context && auth.context !== 'undefined' && getAppContext(auth.context);

        if(zoomContext.mid && zoomContext.uid)  
        {
            client.join(auth.context.mid);
            client.join(auth.context.uid);
        }

        this.logger.log(`Client connected: ${client.id}`);
    }
}