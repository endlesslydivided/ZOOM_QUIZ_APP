import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';

import { Answer } from '../answers/answer.entity';
import { PlaySession } from '../play-sessions/playSession.entity';
import { SoftModelEntity } from '../share/entity/softModel.entity';

@Entity({ name: 'quiz' })
export class Quiz extends SoftModelEntity {
  @ApiProperty({
    example: '792b9eec-1450-437d-9e9d-f220bf335336',
    description: 'Quiz question text',
  })
  @Column()
  userId: string;

  @ApiProperty({
    example: 'What is the closest planet to the Sun?',
    description: 'Quiz question text',
  })
  @Column()
  text: string;

  @OneToMany(() => PlaySession, (session) => session.quiz, {
    nullable: false,
    createForeignKeyConstraints: true,
  })
  playSessions: PlaySession[];

  @OneToMany(() => Answer, (answer) => answer.quiz, {
    createForeignKeyConstraints: true,
  })
  answers: Answer[];
}
