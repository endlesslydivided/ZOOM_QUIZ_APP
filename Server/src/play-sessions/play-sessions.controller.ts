import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ZoomContextGuard } from 'src/auth/guards/zoomContext.guard';
import { PlaySessionsService } from './play-sessions.service';
import { ZoomContext } from 'src/auth/decorators/zoomContext.decorator';
import { QueryParamsPipe } from 'src/requestFeatures/queryParams.pipe';
import QueryParameters from 'src/requestFeatures/query.params';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';
import { ZoomAccessToken } from 'src/auth/decorators/accessToken.decorator';

@Controller('play-sessions')
@UseGuards(ZoomContextGuard)
export class PlaySessionsController {

    constructor(private playSessionsService: PlaySessionsService) {}

    @Get('/results')
    getPlaySessionsResults(@ZoomContext() context:any,@Query(new QueryParamsPipe()) filters: QueryParameters,) 
    {
      return this.playSessionsService.getPlaySessionsResults(filters,context);
    }

    @Get()
    getPlaySessions(@ZoomContext() context:any) 
    {
      return this.playSessionsService.getPlaySessions(context);
    }

    @Get('/:playSessionId/report')
    getPlaySessionReport(
      @ZoomContext() context:any,
      @Param('playSessionId') playSessionId:string) 
    {
      return this.playSessionsService.getPlaySessionReport(playSessionId,context);
    }
}



    