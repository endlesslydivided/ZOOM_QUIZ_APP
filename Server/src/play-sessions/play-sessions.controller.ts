import { Controller, Get, UseGuards } from '@nestjs/common';
import { ZoomContextGuard } from 'src/auth/guards/zoomContext.guard';
import { PlaySessionsService } from './play-sessions.service';
import { ZoomContext } from 'src/auth/decorators/zoomContext.decorator';

@Controller('play-sessions')
@UseGuards(ZoomContextGuard)
export class PlaySessionsController {

    constructor(private playSessionsService: PlaySessionsService) {}

    @Get('/results')
    getPlaySessionsResults(@ZoomContext() context:any) 
    {
      return this.playSessionsService.getPlaySessionsResults(context);
    }

    @Get()
    getPlaySessions(@ZoomContext() context:any) 
    {
      return this.playSessionsService.getPlaySessions(context);
    }
}



    