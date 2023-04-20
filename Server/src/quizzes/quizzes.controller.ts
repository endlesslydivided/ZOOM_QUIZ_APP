import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { ZoomContextGuard } from 'src/auth/guards/zoomContext.guard';
import { CreateQuizDTO } from './dto/createQuiz.dto';
import { ZoomContext } from 'src/auth/decorators/zoomContext.decorator';
import { QueryParamsPipe } from 'src/requestFeatures/queryParams.pipe';
import QueryParameters from 'src/requestFeatures/query.params';

@Controller('quizzes')
@UseGuards(ZoomContextGuard)
export class QuizzesController {

    constructor(private quizzesService: QuizzesService) {}

    @Post()
    createQuiz(@Body() dto: CreateQuizDTO, @ZoomContext() context:ZoomContext) 
    {
      return this.quizzesService.createQuiz(dto, context);
    }

    @Get()
    getUserQuizzes(@ZoomContext() context:any,@Query(new QueryParamsPipe()) filters: QueryParameters) 
    {
      return this.quizzesService.getUserQuizzes(filters,context);
    }

  

    @Delete(':quizId')
    deleteQuiz(@Param('quizId') quizId: string) 
    {
      return this.quizzesService.deleteQuiz(quizId);
    }
}
