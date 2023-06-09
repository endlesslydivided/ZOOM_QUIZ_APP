import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ZoomContext } from '../auth/decorators/zoomContext.decorator';
import { ZoomContextGuard } from '../auth/guards/zoomContext.guard';
import QueryParameters from '../requestFeatures/query.params';
import { QueryParamsPipe } from '../requestFeatures/queryParams.pipe';
import { Report } from './interfaces/interfaces';
import { PlaySessionsService } from './play-sessions.service';
import { PlaySession } from './playSession.entity';

@Controller('play-sessions')
@UseGuards(ZoomContextGuard)
export class PlaySessionsController {
  constructor(private playSessionsService: PlaySessionsService) {}

  @Get('/results')
  async getPlaySessionsResults(
    @ZoomContext() context: ZoomContext,
    @Query(new QueryParamsPipe()) filters: QueryParameters,
  ): Promise<[PlaySession[], number]> {
    return await this.playSessionsService.getPlaySessionsResults(
      filters,
      context,
    );
  }

  @Get()
  async getPlaySessions(
    @ZoomContext() context: ZoomContext,
  ): Promise<PlaySession[]> {
    return await this.playSessionsService.getPlaySessions(context);
  }

  @Get('/:playSessionId/report')
  async getPlaySessionReport(
    @Param('playSessionId') playSessionId: string,
  ): Promise<Report> {
    return await this.playSessionsService.getPlaySessionReport(
      playSessionId,
    );
  }
}
