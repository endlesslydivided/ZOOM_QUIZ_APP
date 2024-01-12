import { Inject, Logger, UseGuards } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { Answer } from '../answers/answer.entity';
import { ZoomContext } from '../auth/decorators/zoomContext.decorator';
import { ZoomContextGuard } from '../auth/guards/zoomContext.guard';
import { CreatePlaySessionDTO } from '../play-sessions/createPlaySession.dto';
import { PlaySessionsService } from '../play-sessions/play-sessions.service';
import { PlaySession } from '../play-sessions/playSession.entity';
import { CreateResultDTO } from '../results/createResult.dto';
import { Result } from '../results/result.entity';
import { ResultsService } from '../results/results.service';
import { getAppContext } from '../share/utils/cipher';
import { QuizzesService } from './quizzes.service';
import { ConfigService } from '@nestjs/config';

export enum QuizClientEvent {
  SERVER_SENDS_ANSWERS = 'SERVER_SENDS_ANSWER',
  SERVER_PROVIDES_QUIZ = 'SERVER_PROVIDES_QUIZ',
}

export enum QuizServerEvent {
  CLIENT_PROVIDES_QUIZ = 'CLIENT_PROVIDES_QUIZ',
  CLIENT_SENDS_ANSWER = 'CLIENT_SENDS_ANSWER',
}

type CreatePlaySessionMessage = {
  playSession: CreatePlaySessionDTO;
};

type CreateResultMessage = {
  result: CreateResultDTO;
};

@WebSocketGateway({
  cors: { origin: true, credentials: true, preflightContinue: false },
  path: '/play-quiz',
  pingTimeout: 100000,
  maxHttpBufferSize: 1e8,
})
export class QuizGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('QuizGateway');

  constructor(
    @Inject(QuizzesService)
    private quizzesService: QuizzesService,
    @Inject(PlaySessionsService)
    private playSessionsService: PlaySessionsService,
    @Inject(ResultsService)
    private resultsService: ResultsService,
    private configService: ConfigService
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage(QuizServerEvent.CLIENT_PROVIDES_QUIZ)
  async handleProvidesQuiz(
    @MessageBody()
    body: unknown & { meetId: string } & CreatePlaySessionMessage,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const zoomContext: ZoomContext =
      client.handshake.auth.context &&
      getAppContext(client.handshake.auth.context,this.configService.get<string>('ZM_CLIENT_SECRET'));

    const playSessionQuiz: PlaySession =
      await this.playSessionsService.createPlaySession({
        ...body.playSession,
        meetId: zoomContext.mid,
      });

    this.server
      .to(body?.meetId)
      .emit(QuizClientEvent.SERVER_PROVIDES_QUIZ, playSessionQuiz);
  }

  @SubscribeMessage(QuizServerEvent.CLIENT_SENDS_ANSWER)
  async handleSendsAnswer(
    @MessageBody() body: unknown & { userid: string } & CreateResultMessage,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const zoomContext: ZoomContext =
      client.handshake.auth.context &&
      getAppContext(client.handshake.auth.context,this.configService.get<string>('ZM_CLIENT_SECRET'));

    const result: Result = await this.resultsService.createResult({
      ...body.result,
      userId: zoomContext.uid,
    });
    const answers: Answer[] = await this.quizzesService.getQuizAnswers(
      result.playSession.quiz.id,
    );

    this.server.to(body?.userid).emit(QuizClientEvent.SERVER_SENDS_ANSWERS, {
      results: [result],
      answers,
    });
  }

  afterInit(server: Server): void {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @UseGuards(ZoomContextGuard)
  handleConnection(client: Socket, ...args: unknown[]): void {
    const auth: Record<string, string> = client.handshake.auth;
    const zoomContext: ZoomContext =
      auth.context &&
      auth.context !== 'undefined' &&
      getAppContext(auth.context,this.configService.get<string>('ZM_CLIENT_SECRET'));

    if (zoomContext.mid && zoomContext.uid) {
      client.join(zoomContext.mid);
      client.join(zoomContext.uid);
    }

    this.logger.log(`Client connected: ${client.id}`);
  }
}
