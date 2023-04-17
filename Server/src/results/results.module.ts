import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Result } from './result.entity';
import { Answer } from 'src/answers/answer.entity';
import { PlaySession } from 'src/play-sessions/playSession.entity';
import { ResultsService } from './results.service';

@Module({
    imports:[TypeOrmModule.forFeature([Result, Answer,PlaySession])],
    providers: [ResultsService],
    exports:[ResultsService]

})
export class ResultsModule {
    
}
