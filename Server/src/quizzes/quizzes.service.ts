import { Inject, Injectable, InternalServerErrorException, forwardRef } from '@nestjs/common';
import { Answer } from 'src/answers/answer.entity';
import { ZoomContext } from 'src/auth/decorators/zoomContext.decorator';
import DBQueryParameters from 'src/requestFeatures/dbquery.params';
import { DataSource } from 'typeorm';
import { CreateQuizDTO } from './dto/createQuiz.dto';
import { Quiz } from './quiz.entity';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class QuizzesService {

    constructor(private dataSource: DataSource,) {}
    

    async createQuiz(quizDto:CreateQuizDTO,context:ZoomContext)
    {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        const answers =  await Promise.all(quizDto.answers.map( async (a) => {
            const answer = new Answer();
            answer.isCorrect = a.isCorrect;
            answer.text = a.text;

            const answerResult = await queryRunner.manager.save(answer).catch(async (error:any) =>
            {
                await queryRunner.rollbackTransaction();
                await queryRunner.release();
                throw new InternalServerErrorException('Quiz is not created. Internal server error occured.');
            });    
            return answerResult;
        }))

        const quiz = new Quiz();

        quiz.text = quizDto.text;
        quiz.answers = answers;
        quiz.userId = context.uid;

        const quizResult = await queryRunner.manager.save(quiz).catch(async (error:any) =>
        {
            await queryRunner.rollbackTransaction();
            await queryRunner.release();
            throw new InternalServerErrorException('Quiz is not created. Internal server error occured.');
        });    
        
        await queryRunner.commitTransaction();
        await queryRunner.release();
        return quizResult;
    }

    async getUserQuizzes(filters:DBQueryParameters,context:any)
    {
        const quizRepository = this.dataSource.getRepository(Quiz);
        const quizzes = await quizRepository.findAndCount({
            take:filters.limit,
            skip: filters.offset,
            where:{userId:context.uid}, 
            relations:{answers:true,playSessions:true}},
            )
            .catch((error:any) =>
            {
                console.log(error);
                throw new InternalServerErrorException('User quizzes aren`t found. Internal server error occure');
            });
        return quizzes;
    }


    async getOneQuiz(quizId:string)
    {
        const quizRepository = this.dataSource.getRepository(Quiz);
        const quizz = await quizRepository.findOneBy({id:quizId}).catch((error:any) =>
        {
            console.log(error);
            throw new InternalServerErrorException('Quiz isn`t found. Internal server error occure');
        });
        return quizz;
    }




    async getQuizAnswers(quizId:string)
    {
        const answerRepository = this.dataSource.getRepository(Answer);
        const answers = await answerRepository.findBy({quiz:{id:quizId}}).catch((error:any) =>
        {
            console.log(error);
            throw new InternalServerErrorException('Answers aren`t found. Internal server error occure');
        });
        return answers;

    }

    async deleteQuiz(quizId:any)
    {
        const quizRepository = this.dataSource.getRepository(Quiz);
        const result = await quizRepository.softDelete(quizId).catch((error:any) =>
        {
            console.log(error);
            throw new InternalServerErrorException('Quiz isn`t deleted. Internal server error occure');
        });
        return result;

    }
}
