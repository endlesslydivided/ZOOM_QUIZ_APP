import { Module } from '@nestjs/common';
import { PlaySessionsController } from './play-sessions.controller';
import { PlaySessionsService } from './play-sessions.service';

@Module({
  providers: [PlaySessionsService],
  controllers: [PlaySessionsController],
  exports: [PlaySessionsService],
})
export class PlaySessionsModule {}
