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
import { QuizzesService } from './quizzes.service';
import { ZoomContextGuard } from '../auth/guards/zoomContext.guard';
import { CreateQuizDTO } from './dto/createQuiz.dto';
import { ZoomContext } from '../auth/decorators/zoomContext.decorator';
import { QueryParamsPipe } from '../requestFeatures/queryParams.pipe';
import QueryParameters from '../requestFeatures/query.params';
import { Quiz } from './quiz.entity';
import { UpdateResult } from 'typeorm';

@Controller('quizzes')
@UseGuards(ZoomContextGuard)
export class QuizzesController {
  constructor(private quizzesService: QuizzesService) {}

  @Post()
  async createQuiz(
    @Body() dto: CreateQuizDTO,
    @ZoomContext() context: ZoomContext,
  ): Promise<Quiz> {
    return await this.quizzesService.createQuiz(dto, context);
  }

  @Get()
  async getUserQuizzes(
    @ZoomContext() context: ZoomContext,
    @Query(new QueryParamsPipe()) filters: QueryParameters,
  ): Promise<[Quiz[], number]> {
    return await this.quizzesService.getUserQuizzes(filters, context);
  }

  @Delete(':quizId')
  async deleteQuiz(@Param('quizId') quizId: string): Promise<UpdateResult> {
    return await this.quizzesService.deleteQuiz(quizId);
  }
}
