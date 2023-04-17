import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { ZoomContextGuard } from 'src/auth/guards/zoomContext.guard';
import { CreateQuizDTO } from './dto/createQuiz.dto';
import { ZoomContext } from 'src/auth/decorators/zoomContext.decorator';

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
    getUserQuizzes(@ZoomContext() context:any) 
    {
      return this.quizzesService.getUserQuizzes(context);
    }
}
