import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreatePlaySessionDTO } from './dto/CreatePlaySession';
import { Quiz } from 'src/quizzes/quiz.entity';
import { PlaySession } from './playSession.entity';

@Injectable()
export class PlaySessionsService {

    constructor(private dataSource: DataSource) {}
    

    async createPlaySession(dto:CreatePlaySessionDTO)
    {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        const quiz = await this.dataSource.getRepository(Quiz).findOneBy({id:dto.quizId}).catch((error:any) =>
        {
            console.log(error);
            throw new InternalServerErrorException('Quiz isn`t found. Internal server error occure');
        });;

        const playSession = new PlaySession();

        
        playSession.meetId = dto.meetId;

        const playSessionResult = await queryRunner.manager.save(playSession).catch(async (error:any) =>
        {
            await queryRunner.rollbackTransaction();
            await queryRunner.release();
            throw new InternalServerErrorException('PlaySession is not created. Internal server error occured.');
        });
        
        await this.dataSource
        .createQueryBuilder()
        .relation(PlaySession, "quiz")
        .of(playSessionResult)
        .add(quiz)
        
        await queryRunner.commitTransaction();
        await queryRunner.release();
        return playSessionResult;
    }

    async getPlaySessionsResults(context:any)
    {
        const playSessionsResults = await this.dataSource
        .createQueryBuilder()
        .select("playSession").from(PlaySession,"playSessions")
        .leftJoinAndMapMany("playSessions.quizzes","playSession.quiz","playSessionQuizzes")
        .leftJoinAndMapOne("playSessions.result","playSession.results","playSessionUserResult",
        "playSessionUserResult.userId = :userId",{userId:context.uid})
        .getMany();

        return playSessionsResults;
    }
}
