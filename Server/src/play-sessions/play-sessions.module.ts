import { Module } from '@nestjs/common';

import { PlaySessionsController } from './play-sessions.controller';
import { PlaySessionsService } from './play-sessions.service';
import { PlaySessionRepository } from './play-sessions.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaySession } from './playSession.entity';

@Module({
  imports:[TypeOrmModule.forFeature([PlaySession])],
  providers: [PlaySessionsService,PlaySessionRepository],
  controllers: [PlaySessionsController],
  exports: [PlaySessionsService],
})
export class PlaySessionsModule {}
