import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { ZoomContextMiddleware } from './auth/middlewares/zoomContext.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizzesModule } from './quizzes/quizzes.module';
import { ReportsModule } from './reports/reports.module';
import { AnswersModule } from './answers/answers.module';
import { Quiz } from './quizzes/quiz.entity';
import { Answer } from './answers/answer.entity';
import { ResultsModule } from './results/results.module';
import { Result } from './results/result.entity';
import { Report } from './reports/report.entity';
import { PlaySessionsModule } from './play-sessions/play-sessions.module';
import { PlaySession } from './play-sessions/playSession.entity';

@Module({
  imports: [AuthModule,
    ConfigModule.forRoot({
      envFilePath:'.env'
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      logging:true,
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [Quiz,Answer,Result,Report,PlaySession],
      synchronize: true,
      autoLoadEntities:true
    }),
    QuizzesModule,
    ReportsModule,
    AnswersModule,
    ResultsModule,
    PlaySessionsModule,
  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ZoomContextMiddleware)
      .forRoutes('/','/quizzes','/reports','/play-sessions')

  }
}
