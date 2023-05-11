import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateResult } from 'typeorm';

import { ZoomContext } from '../auth/decorators/zoomContext.decorator';
import { ZoomContextGuard } from '../auth/guards/zoomContext.guard';
import QueryParameters from '../share/requestFeatures/query.params';
import { QueryParamsPipe } from '../share/requestFeatures/queryParams.pipe';
import { CreateQuizDTO } from './createQuiz.dto';
import { Quiz } from './quiz.entity';
import { QuizzesService } from './quizzes.service';

@ApiTags('Quizzes')
@Controller('quizzes')
@UseGuards(ZoomContextGuard)
export class QuizzesController {
  constructor(private quizzesService: QuizzesService) {}

  @ApiOperation({ summary: 'Create quiz' })
  @ApiCreatedResponse({ type: Quiz })
  @ApiBody({ type: CreateQuizDTO })
  @Post()
  async createQuiz(
    @Body() dto: CreateQuizDTO,
    @ZoomContext() context: ZoomContext,
  ): Promise<Quiz> {
    return await this.quizzesService.createQuiz(dto, context);
  }

  @ApiOperation({ summary: 'Get user quizzes' })
  @ApiOkResponse({ type: '[Quiz[], number]' })
  @ApiQuery({ type: QueryParameters })
  @Get()
  async getUserQuizzes(
    @ZoomContext() context: ZoomContext,
    @Query(new QueryParamsPipe()) filters: QueryParameters,
  ): Promise<[Quiz[], number]> {
    return await this.quizzesService.getUserQuizzes(filters, context);
  }

  @ApiOperation({ summary: 'Delete one quiz' })
  @ApiOkResponse({ type: UpdateResult })
  @Delete(':quizId')
  async deleteQuiz(@Param('quizId') quizId: string): Promise<UpdateResult> {
    return await this.quizzesService.deleteQuiz(quizId);
  }
}
