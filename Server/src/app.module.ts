import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AnswersModule } from './answers/answers.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AccessTokenMiddleware } from './auth/middlewares/accessToken.middleware';
import { RefreshTokenMiddleware } from './auth/middlewares/refreshToken.middleware';
import { ZoomContextMiddleware } from './auth/middlewares/zoomContext.middleware';
import { DatabaseModule } from './data-sources/database.module';
import { PlaySessionsModule } from './play-sessions/play-sessions.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { ResultsModule } from './results/results.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    DatabaseModule,
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
