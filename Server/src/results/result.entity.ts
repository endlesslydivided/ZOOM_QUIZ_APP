import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Answer } from '../answers/answer.entity';
import { PlaySession } from '../play-sessions/playSession.entity';
import { BaseModelEntity } from '../share/entity/baseModel.entity';

@Entity({ name: 'result' })
export class Result extends BaseModelEntity {
  @ApiProperty({
    example: '792b9eec-1450-437d-9e9d-f220bf335336',
    description: 'Result answer id',
  })
  @Column()
  userId: string;

  @ManyToOne(() => Answer, (answer) => answer.results, { nullable: true })
  @JoinColumn({ name: 'answerId', referencedColumnName: 'id' })
  answer: Answer;

  @ManyToOne(() => PlaySession, (playSession) => playSession.results, {
    nullable: false,
  })
  @JoinColumn({ name: 'playSessionId', referencedColumnName: 'id' })
  playSession: PlaySession;
}
