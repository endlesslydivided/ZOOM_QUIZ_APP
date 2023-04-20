import { Inject, Injectable, InternalServerErrorException, forwardRef } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreatePlaySessionDTO } from './dto/CreatePlaySession';
import { Quiz } from 'src/quizzes/quiz.entity';
import { PlaySession } from './playSession.entity';
import DBQueryParameters from 'src/requestFeatures/dbquery.params';
import { filter } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { ZoomContext } from 'src/auth/decorators/zoomContext.decorator';

@Injectable()
export class PlaySessionsService {

    constructor(private dataSource: DataSource,
        @Inject(forwardRef(() => AuthService)) private authService: AuthService,
) {}
    

    async createPlaySession(dto:CreatePlaySessionDTO)
    {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        const quiz = await this.dataSource.getRepository(Quiz).findOne({where:{id:dto.quizId},relations:['answers']}).catch((error:any) =>
        {
            console.log(error);
            throw new InternalServerErrorException('Quiz isn`t found. Internal server error occure');
        });;

        const playSession = new PlaySession();

        
        playSession.meetId = dto.meetId;
        playSession.quiz = quiz;

        const playSessionResult = await queryRunner.manager.save(playSession).catch(async (error:any) =>
        {
            await queryRunner.rollbackTransaction();
            await queryRunner.release();
            throw new InternalServerErrorException('PlaySession is not created. Internal server error occured.');
        });
       
        
        await queryRunner.commitTransaction();
        await queryRunner.release();
        return playSessionResult;
    }

    async getPlaySessionsResults(filters:DBQueryParameters,context:any)
    {
        const playSessionsResults = await this.dataSource
        .createQueryBuilder(PlaySession,"playSessions").withDeleted()
        .leftJoinAndSelect("playSessions.quiz","quiz")
        .leftJoinAndSelect("quiz.answers","answers")
        .leftJoinAndSelect("playSessions.results","result","result.userId = :userId",{userId:context.uid})
        .leftJoinAndSelect("result.answer","answer")
        .select([
            `playSessions.id`, `playSessions.meetId`, `playSessions.createdAt`, 
            `quiz.id`, `quiz.userId`, `quiz.text`,`quiz.createdAt`,
            `answers.id`,`answers.text`,`answers.isCorrect`,
            `result.id`,`result.createdAt`,
            `answer.id`,`answer.isCorrect`])
        .take(filters.limit)
        .skip(filters.offset)
        .getManyAndCount()


        return playSessionsResults;
    }

    async getPlaySessions(context:any)
    {
        const playSessions = await this.dataSource
        .createQueryBuilder(PlaySession,"playSessions")
        .leftJoinAndSelect("playSessions.quiz","quiz","quiz.deletedAt IS NOT NULL")
        .leftJoinAndSelect("quiz.answers","answers")
        .leftJoinAndSelect("playSessions.results","result","result.userId = :userId",{userId:context.uid})
        .leftJoinAndSelect("result.answer","answer")
        .select([
            `playSessions.id`, `playSessions.meetId`, `playSessions.createdAt`, 
            `quiz.id`, `quiz.userId`, `quiz.text`,`quiz.createdAt`,
            `answers.id`,`answers.text`,`answers.isCorrect`,
            `result.id`,`result.createdAt`,
            `answer.id`,`answer.isCorrect`])
        .where("playSessions.meetId = :meetId",{meetId:context.mid})
        .getMany()
        return playSessions;
    }

    async getPlaySessionReport(playSessionId:string,context:ZoomContext)
    {
        const meetingUsers = await this.authService.apiRequest('GET',`/past_meetings/${playSessionId}/participants`,process.env.ZM_SECRET_TOKEN);
        return meetingUsers;
    }}
