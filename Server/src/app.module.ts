import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { Answer } from './answers/answer.entity';
import { AnswersModule } from './answers/answers.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ZoomContextMiddleware } from './auth/middlewares/zoomContext.middleware';
import { PlaySessionsModule } from './play-sessions/play-sessions.module';
import { PlaySession } from './play-sessions/playSession.entity';
import { Quiz } from './quizzes/quiz.entity';
import { QuizzesModule } from './quizzes/quizzes.module';
import { Result } from './results/result.entity';
import { ResultsModule } from './results/results.module';
import { AccessTokenMiddleware } from './auth/middlewares/accessToken.middleware';
import { RefreshTokenMiddleware } from './auth/middlewares/refreshToken.middleware';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      logging: true,
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [Quiz, Answer, Result, PlaySession],
      synchronize: true,
      autoLoadEntities: true,
    }),
    QuizzesModule,
    AnswersModule,
    ResultsModule,
    PlaySessionsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(ZoomContextMiddleware)
      .forRoutes(
        '/',
        '/context',
        '/quizzes',
        '/play-sessions',
        '/play-quiz',
        '/auth/me',
      );

    consumer.apply(AccessTokenMiddleware).forRoutes('/auth/me');

    consumer.apply(RefreshTokenMiddleware).forRoutes('/auth/refresh-token');
  }
}
