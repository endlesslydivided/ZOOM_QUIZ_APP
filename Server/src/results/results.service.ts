import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateResultDTO } from './dto/CreateResult.dto';
import { PlaySession } from 'src/play-sessions/playSession.entity';
import { Result } from './result.entity';
import { Answer } from 'src/answers/answer.entity';

@Injectable()
export class ResultsService {

    constructor(private dataSource: DataSource) {}
    

    async createResult(dto:CreateResultDTO)
    {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        const playSession = await this.dataSource.getRepository(PlaySession).findOneBy({id:dto.playSessionId}).catch((error:any) =>
        {
            console.log(error);
            throw new InternalServerErrorException('Result isn`t created. Internal server error occure');
        });;

        const answer = await this.dataSource.getRepository(Answer).findOneBy({id:dto.answerId}).catch((error:any) =>
        {
            console.log(error);
            throw new InternalServerErrorException('Result isn`t created. Internal server error occure');
        });;

        const answerResult = new Result();

        answerResult.playSession = playSession;
        answerResult.userId = dto.userId;
        answerResult.answer = answer;

        const result = await queryRunner.manager.save(answerResult).catch(async (error:any) =>
        {
            await queryRunner.rollbackTransaction();
            await queryRunner.release();
            throw new InternalServerErrorException('Result entry is not created. Internal server error occured.');
        });    
        
        await queryRunner.commitTransaction();
        await queryRunner.release();
      
        return result;
    }

    
}
