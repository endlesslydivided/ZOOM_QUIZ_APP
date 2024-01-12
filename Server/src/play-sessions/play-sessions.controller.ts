import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ZoomContext } from '../auth/decorators/zoomContext.decorator';
import { ZoomContextGuard } from '../auth/guards/zoomContext.guard';
import QueryParameters from '../share/requestFeatures/query.params';
import { QueryParamsPipe } from '../share/requestFeatures/queryParams.pipe';
import { Report } from './interfaces';
import { PlaySessionsService } from './play-sessions.service';
import { PlaySession } from './playSession.entity';

@ApiTags('Play sessions')
@Controller('play-sessions')
@UseGuards(ZoomContextGuard)
export class PlaySessionsController {
  constructor(private playSessionsService: PlaySessionsService) {}

  @ApiOperation({ summary: 'Get play session results' })
  @ApiOkResponse({ type: '[PlaySession[], number]' })
  @Get('/results')
  async getPlaySessionsResults(
    @ZoomContext() context: ZoomContext,
    @Query(new QueryParamsPipe()) filters: QueryParameters,
  ): Promise<[PlaySession[], number]> {
    try {
      return await this.playSessionsService.getPlaySessionsResults(
        filters,
        context,
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  @ApiOperation({ summary: 'Get play sessions' })
  @ApiOkResponse({ type: Array<PlaySession> })
  @Get()
  async getPlaySessions(
    @ZoomContext() context: ZoomContext,
  ): Promise<PlaySession[]> {
    try {
      return await this.playSessionsService.getPlaySessions(context);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  @ApiOperation({ summary: 'Get play sessions' })
  @ApiOkResponse({ type: 'Report' })
  @Get('/:playSessionId/report')
  async getPlaySessionReport(
    @Param('playSessionId') playSessionId: string,
  ): Promise<Report> {
    try {
      return await this.playSessionsService.getPlaySessionReport(playSessionId);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
